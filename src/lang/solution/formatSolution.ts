import { indent } from "../../utils/indent.js"
import type { Ctx } from "../ctx/index.js"
import { ctxLookupType } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import type { Solution } from "../solution/index.js"
import * as Values from "../value/index.js"

export function formatSolution(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  names: Array<string>,
): string {
  const properties: Array<string> = []
  for (const name of names) {
    const type = ctxLookupType(ctx, name)
    if (type === undefined) {
      throw new Error(
        `[formatSolution] can not find the type of pattern variable: ${name}`,
      )
    }

    const value = Values.PatternVar(type, name)
    properties.push(`${name}: ${Values.formatValue(mod, ctx, type, value)}`)

    // let value = solutionLookupValue(solution, name)
    // if (value === undefined) {
    //   properties.push(`${name}: TODO(${Values.formatType(mod, ctx, type)})`)
    // } else {
    //   properties.push(`${name}: ${Values.formatValue(mod, ctx, type, value)}`)
    // }
  }

  return properties.length === 0
    ? "{}"
    : `{\n${indent(properties.join(",\n"))}\n}`
}
