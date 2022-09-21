import { formatCore } from "../core"
import { Ctx, lookupTypeInCtx } from "../ctx"
import { Solution } from "../solution"
import { readback, readbackType } from "../value"

export function formatSolution(
  solution: Solution,
  ctx: Ctx,
  names: Array<string>,
): string {
  const properties: Array<string> = []
  for (const name of names) {
    const type = lookupTypeInCtx(ctx, name)
    if (type === undefined) {
      throw new Error(`formatSolution find type of name: ${name}`)
    }

    let value = solution.lookupValue(name)
    if (value === undefined) {
      const typeCore = readbackType(ctx, type)
      properties.push(`${name}: TODO(${formatCore(typeCore)})`)
    } else {
      value = solution.deepWalk(ctx, value)
      const core = readback(ctx, type, value)
      properties.push(`${name}: ${formatCore(core)}`)
    }
  }

  return `{ ${properties.join(", ")} }`
}
