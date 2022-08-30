import { Neutral } from "../neutral"
import { Closure } from "./Closure"

export type Value = TypedNeutral | Global | Pi | Fn | Sigma

export type AlreadyType = Pi

export type TypedNeutral = {
  family: "Value"
  kind: "TypedNeutral"
  type: Value
  neutral: Neutral
}

export function TypedNeutral(type: Value, neutral: Neutral): TypedNeutral {
  return {
    family: "Value",
    kind: "TypedNeutral",
    type,
    neutral,
  }
}

/**

   TODO We will need `args: Array<Values.Arg>` for currying.

**/

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

export type Sigma = {
  family: "Value"
  kind: "Sigma"
  carType: Value
  cdrTypeClosure: Closure
}

export function Sigma(carType: Value, cdrTypeClosure: Closure): Sigma {
  return {
    family: "Value",
    kind: "Sigma",
    carType,
    cdrTypeClosure,
  }
}
