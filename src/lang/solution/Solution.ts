import { formatCore } from "../core"
import { Ctx, ctxToEnv, lookupTypeInCtx } from "../ctx"
import { Env, EnvCons } from "../env"
import { deepWalk, isPatternVar } from "../solution"
import { readback, readbackType, Value } from "../value"

export class Solution {
  bindings: Map<string, Value> = new Map()

  enrichCtx(ctx: Ctx): Env {
    let env = ctxToEnv(ctx)
    for (const [name, value] of this.bindings.entries()) {
      env = EnvCons(name, this.deepWalk(ctx, value), env)
    }

    return env
  }

  enrichEnv(env: Env): Env {
    for (const [name, value] of this.bindings.entries()) {
      env = EnvCons(name, value, env)
    }

    return env
  }

  get names(): Array<string> {
    return Array.from(this.bindings.keys())
  }

  bind(name: string, value: Value): this {
    this.bindings.set(name, value)
    return this
  }

  lookupValue(name: string): Value | undefined {
    const value = this.bindings.get(name)
    if (value === undefined) return undefined
    if (isPatternVar(value) && value.neutral.name === name) return undefined
    return value
  }

  walk(value: Value): Value {
    while (isPatternVar(value)) {
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
