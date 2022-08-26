import { Value } from "./Value"

export type Solution = SolutionCons | SolutionNull | SolutionFailure

/**

   TODO Should there be `SolutionFulfilled`, like `CtxFulfilled`?

**/

export type SolutionCons = {
  kind: "SolutionCons"
  name: string
  value: Value
  rest: Solution
}

export type SolutionNull = {
  kind: "SolutionNull"
}

export type SolutionFailure = {
  kind: "SolutionFailure"
  message: string
}

export function SolutionCons(
  name: string,
  value: Value,
  rest: Solution
): SolutionCons {
  return {
    kind: "SolutionCons",
    name,
    value,
    rest,
  }
}

export function SolutionNull(): SolutionNull {
  return {
    kind: "SolutionNull",
  }
}

export function SolutionFailure(message: string): SolutionFailure {
  return {
    kind: "SolutionFailure",
    message,
  }
}
