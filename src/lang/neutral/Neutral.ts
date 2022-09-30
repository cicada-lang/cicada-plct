import { TypedValue, Value } from "../value"

export type Neutral = Var | Ap | ApImplicit | Car | Cdr | Dot

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
  targetType: Value
  arg: TypedValue
}

export function Ap(target: Neutral, targetType: Value, arg: TypedValue): Ap {
  return {
    family: "Neutral",
    kind: "Ap",
    target,
    targetType,
    arg,
  }
}

export type ApImplicit = {
  family: "Neutral"
  kind: "ApImplicit"
  target: Neutral
  targetType: Value
  arg: TypedValue
}

export function ApImplicit(target: Neutral, targetType: Value, arg: TypedValue): ApImplicit {
  return {
    family: "Neutral",
    kind: "ApImplicit",
    targetType,
    target,
    arg,
  }
}

export type Car = {
  family: "Neutral"
  kind: "Car"
  target: Neutral
  targetType: Value
}

export function Car(target: Neutral, targetType: Value): Car {
  return {
    family: "Neutral",
    kind: "Car",
    target,
    targetType,
  }
}

export type Cdr = {
  family: "Neutral"
  kind: "Cdr"
  target: Neutral
  targetType: Value
}

export function Cdr(target: Neutral, targetType: Value): Cdr {
  return {
    family: "Neutral",
    kind: "Cdr",
    target,
    targetType,
  }
}

export type Dot = {
  family: "Neutral"
  kind: "Dot"
  target: Neutral
  targetType: Value
  name: string
}

export function Dot(target: Neutral, targetType: Value, name: string): Dot {
  return {
    family: "Neutral",
    kind: "Dot",
    target,
    targetType,
    name,
  }
}
