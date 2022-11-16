import { Solution } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function solutionLookupValue(
  solution: Solution,
  name: string,
): Value | undefined {
  const value = solution.bindings.get(name)
  if (value === undefined) return undefined
  if (Values.isMetaVar(value) && value.neutral.name === name) return undefined
  return value
}
