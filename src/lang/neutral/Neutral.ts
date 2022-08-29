import { TypedValue } from "../value"

export type Neutral = Var | Ap

export type Var = {
  family: "Neutral"
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    family: "Neutral",
    kind: "Var",
    name,
  }
}

export type Ap = {
  family: "Neutral"
  kind: "Ap"
  target: Neutral
  arg: TypedValue
}

export function Ap(target: Neutral, arg: TypedValue): Ap {
  return {
    family: "Neutral",
    kind: "Ap",
    target,
    arg,
  }
}
