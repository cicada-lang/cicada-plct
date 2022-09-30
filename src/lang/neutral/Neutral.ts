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
    targetType,
    target,
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

export function Car(targetType: Value, target: Neutral): Car {
  return {
    family: "Neutral",
    kind: "Car",
    targetType,
    target,
  }
}

export type Cdr = {
  family: "Neutral"
  kind: "Cdr"
  target: Neutral
  targetType: Value
}

export function Cdr(targetType: Value, target: Neutral): Cdr {
  return {
    family: "Neutral",
    kind: "Cdr",
    targetType,
    target,
  }
}

export type Dot = {
  family: "Neutral"
  kind: "Dot"
  target: Neutral
  targetType: Value
  name: string
}

export function Dot(targetType: Value, target: Neutral, name: string): Dot {
  return {
    family: "Neutral",
    kind: "Dot",
    targetType,
    target,
    name,
  }
}
