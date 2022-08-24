export type Solution = SolutionCons | SolutionNull | SolutionFailure

// TODO Should `SolutionCons` also contains type of value -- like `CtxCons`?

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
