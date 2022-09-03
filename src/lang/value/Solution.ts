import { Value } from "./Value"

export type Solution = SolutionNull | SolutionCons | SolutionFailure

/**

   TODO Should there be `SolutionFulfilled`, like `CtxFulfilled`?

**/

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

export type SolutionFailure = {
  kind: "SolutionFailure"
  message: string
}

export function SolutionFailure(message: string): SolutionFailure {
  return {
    kind: "SolutionFailure",
    message,
  }
}
