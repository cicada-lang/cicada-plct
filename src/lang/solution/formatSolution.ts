import { formatCore } from "../core"
import { Ctx, lookupTypeInCtx } from "../ctx"
import { lookupValueInSolution, Solution } from "../solution"
import { readback } from "../value"

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

    const value = lookupValueInSolution(solution, name)
    if (value === undefined) {
      throw new Error(`formatSolution find value of name: ${name}`)
    }

    const core = readback(ctx, type, value)

    properties.push(`${name}: ${formatCore(core)}`)
  }

  return `{ ${properties.join(", ")} }`
}
