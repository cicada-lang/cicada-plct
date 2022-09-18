import { formatCore } from "../core"
import { Ctx, lookupTypeInCtx } from "../ctx"
import { deepWalk, isPatternVar } from "../solution"
import { readback, readbackType, Value } from "../value"

export class Solution {
  bindings: Map<string, Value> = new Map()

  get names(): Array<string> {
    return Array.from(this.bindings.keys())
  }

  bind(name: string, value: Value): this {
    this.bindings.set(name, value)
    return this
  }

  lookupValue(name: string): Value | undefined {
    return this.bindings.get(name)
  }

  walk(value: Value): Value {
    while (isPatternVar(value)) {
      const found = this.lookupValue(value.neutral.name)
      if (found === undefined) return value
      value = found
    }

    return value
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
        value = deepWalk(this, ctx, value)
        const core = readback(ctx, type, value)
        properties.push(`${name}: ${formatCore(core)}`)
      }
    }

    return `{ ${properties.join(", ")} }`
  }
}
