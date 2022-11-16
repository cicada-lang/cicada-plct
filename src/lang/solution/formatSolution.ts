import { indent } from "../../utils/indent"
import type { Ctx } from "../ctx"
import { ctxLookupType } from "../ctx"
import { Mod } from "../mod"
import { Solution } from "../solution"
import * as Values from "../value"

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
        `[formatSolution] can not find the type of meta variable: ${name}`,
      )
    }

    const value = Values.MetaVar(type, name)
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
