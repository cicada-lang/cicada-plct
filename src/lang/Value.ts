import { Closure } from "./Closure"
import { Neutral } from "./Neutral"

export type Value = NotYetValue | Global | Pi | Fn

export type NotYetValue = {
  family: "Value"
  kind: "NotYetValue"
  type: Value
  Neutral: Neutral
}

export function NotYetValue(type: Value, Neutral: Neutral): NotYetValue {
  return {
    family: "Value",
    kind: "NotYetValue",
    type,
    Neutral,
  }
}

// NOTE Maybe need `args: Array<Values.Arg>` for currying.
// NOTE Maybe compute `arity` from `type`.
export type Global = {
  family: "Value"
  kind: "Global"
  name: string
  type: Value
  arity: number
}

export function Global(name: string, type: Value, arity: number): Global {
  return {
    family: "Value",
    kind: "Global",
    name,
    type,
    arity,
  }
}

export type Pi = {
  family: "Value"
  kind: "Pi"
  argType: Value
  retTypeClosure: Closure
}

export function Pi(argType: Value, retTypeClosure: Closure): Pi {
  return {
    family: "Value",
    kind: "Pi",
    argType,
    retTypeClosure,
  }
}

export type Fn = {
  family: "Value"
  kind: "Fn"
  retClosure: Closure
}

export function Fn(retClosure: Closure): Fn {
  return {
    family: "Value",
    kind: "Fn",
    retClosure,
  }
}
