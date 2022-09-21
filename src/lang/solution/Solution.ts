import { formatCore } from "../core"
import { Ctx, ctxToEnv, lookupTypeInCtx } from "../ctx"
import { Env, EnvCons } from "../env"
import * as Neutrals from "../neutral"
import { deepWalk, PatternVar } from "../solution"
import { readback, readbackType, Value } from "../value"

export class Solution {
  patternVars: Array<PatternVar> = []
  bindings: Map<string, Value> = new Map()

  cleanup(): void {
    this.patternVars = []
    this.bindings = new Map()
  }

  enrichCtx(ctx: Ctx): Env {
    let env = ctxToEnv(ctx)

    for (const patternVar of this.patternVars) {
      env = EnvCons(
        patternVar.neutral.name,
        this.deepWalk(ctx, patternVar),
        env,
      )
    }

    for (const [name, value] of this.bindings.entries()) {
      env = EnvCons(name, this.deepWalk(ctx, value), env)
    }

    return env
  }

  get names(): Array<string> {
    return Array.from(this.bindings.keys())
  }

  createPatternVar(name: string, type: Value): PatternVar {
    const patternVar = PatternVar(type, Neutrals.Var(name))
    this.patternVars.push(patternVar)
    return patternVar
  }

  isPatternVar(value: Value): value is PatternVar {
    if (value.kind !== "TypedNeutral") return false
    if (value.neutral.kind !== "Var") return false
    const name = value.neutral.name
    return Boolean(
      this.patternVars.find((patternVar) => patternVar.neutral.name === name),
    )
  }

  bind(name: string, value: Value): void {
    this.bindings.set(name, value)
  }

  private lookupValue(name: string): Value | undefined {
    const value = this.bindings.get(name)
    if (value === undefined) return undefined
    if (this.isPatternVar(value) && value.neutral.name === name)
      return undefined
    return value
  }

  // lookupValue(name: string): Value | undefined {
  //   return this.bindings.get(name)
  // }

  walk(value: Value): Value {
    while (this.isPatternVar(value)) {
      const found = this.lookupValue(value.neutral.name)
      if (found === undefined) return value
      value = found
    }

    return value
  }

  deepWalk(ctx: Ctx, value: Value): Value {
    return deepWalk(this, ctx, value)
  }

  formatSolution(ctx: Ctx, names: Array<string>): string {
    const properties: Array<string> = []
    for (const name of names) {
      const type = lookupTypeInCtx(ctx, name)
      if (type === undefined) {
        throw new Error(`formatSolution find type of name: ${name}`)
      }

      let value = this.lookupValue(name)
      if (value === undefined) {
        const typeCore = readbackType(ctx, type)
        properties.push(`${name}: TODO(${formatCore(typeCore)})`)
      } else {
        value = this.deepWalk(ctx, value)
        const core = readback(ctx, type, value)
        properties.push(`${name}: ${formatCore(core)}`)
      }
    }

    return `{ ${properties.join(", ")} }`
  }
}
