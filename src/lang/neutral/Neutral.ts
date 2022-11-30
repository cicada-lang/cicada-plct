import type { TypedValue, Value } from "../value"

export type Neutral =
  | Var
  | PatternVar
  | Ap
  | ApImplicit
  | Car
  | Cdr
  | Dot
  | Replace

export type Var = {
  "@type": "Neutral"
  "@kind": "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    "@type": "Neutral",
    "@kind": "Var",
    name,
  }
}

export type PatternVar = {
  "@type": "Neutral"
  "@kind": "PatternVar"
  name: string
}

export function PatternVar(name: string): PatternVar {
  return {
    "@type": "Neutral",
    "@kind": "PatternVar",
    name,
  }
}

export type Ap = {
  "@type": "Neutral"
  "@kind": "Ap"
  target: Neutral
  targetType: Value
  arg: TypedValue
}

export function Ap(target: Neutral, targetType: Value, arg: TypedValue): Ap {
  return {
    "@type": "Neutral",
    "@kind": "Ap",
    target,
    targetType,
    arg,
  }
}

export type ApImplicit = {
  "@type": "Neutral"
  "@kind": "ApImplicit"
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
    "@type": "Neutral",
    "@kind": "ApImplicit",
    targetType,
    target,
    arg,
  }
}

export type Car = {
  "@type": "Neutral"
  "@kind": "Car"
  target: Neutral
  targetType: Value
}

export function Car(target: Neutral, targetType: Value): Car {
  return {
    "@type": "Neutral",
    "@kind": "Car",
    target,
    targetType,
  }
}

export type Cdr = {
  "@type": "Neutral"
  "@kind": "Cdr"
  target: Neutral
  targetType: Value
}

export function Cdr(target: Neutral, targetType: Value): Cdr {
  return {
    "@type": "Neutral",
    "@kind": "Cdr",
    target,
    targetType,
  }
}

export type Dot = {
  "@type": "Neutral"
  "@kind": "Dot"
  target: Neutral
  targetType: Value
  name: string
}

export function Dot(target: Neutral, targetType: Value, name: string): Dot {
  return {
    "@type": "Neutral",
    "@kind": "Dot",
    target,
    targetType,
    name,
  }
}

export type Replace = {
  "@type": "Neutral"
  "@kind": "Replace"
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
    "@type": "Neutral",
    "@kind": "Replace",
    target,
    targetType,
    motive,
    base,
  }
}
