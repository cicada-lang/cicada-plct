import { Closure } from "./Closure"
import { Neutral } from "./Neutral"

export type Value = NotYetValue | Pi

export type NotYetValue = {
  kind: "NotYetValue"
  type: Value
  Neutral: Neutral
}

export function NotYetValue(type: Value, Neutral: Neutral) {
  return {
    kind: "NotYetValue",
    type,
    Neutral,
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
