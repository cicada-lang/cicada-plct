import { Value } from "../value"

export type Solution = SolutionNull | SolutionCons

export type SolutionNull = {
  kind: "SolutionNull"
}

export function SolutionNull(): SolutionNull {
  return {
    kind: "SolutionNull",
  }
}

export type SolutionCons = {
  kind: "SolutionCons"
  name: string
  value: Value
  rest: Solution
}

export function SolutionCons(
  name: string,
  value: Value,
  rest: Solution,
): SolutionCons {
  return {
    kind: "SolutionCons",
    name,
    value,
    rest,
  }
}
