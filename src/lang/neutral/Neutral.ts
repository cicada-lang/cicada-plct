import { TypedValue, Value } from "../value"

export type Neutral =
  | Var
  | MetaVar
  | Ap
  | ApImplicit
  | Car
  | Cdr
  | Dot
  | Replace

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

export type MetaVar = {
  family: "Neutral"
  kind: "MetaVar"
  name: string
}

export function MetaVar(name: string): MetaVar {
  return {
    family: "Neutral",
    kind: "MetaVar",
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

export function ApImplicit(
  target: Neutral,
  targetType: Value,
  arg: TypedValue,
): ApImplicit {
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

export type Replace = {
  family: "Neutral"
  kind: "Replace"
  target: Neutral
  targetType: Value
  motive: TypedValue
  base: TypedValue
}

export function Replace(
  target: Neutral,
  targetType: Value,
  motive: TypedValue,
  base: TypedValue,
): Replace {
  return {
    family: "Neutral",
    kind: "Replace",
    target,
    targetType,
    motive,
    base,
  }
}
