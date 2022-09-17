import { TypedValue } from "../value"

export type Neutral = Var | Ap | ImplicitAp | Car | Cdr | Dot

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

export type ImplicitAp = {
  family: "Neutral"
  kind: "ImplicitAp"
  target: Neutral
  arg: TypedValue
}

export function ImplicitAp(target: Neutral, arg: TypedValue): ImplicitAp {
  return {
    family: "Neutral",
    kind: "ImplicitAp",
    target,
    arg,
  }
}

export type Car = {
  family: "Neutral"
  kind: "Car"
  target: Neutral
}

export function Car(target: Neutral): Car {
  return {
    family: "Neutral",
    kind: "Car",
    target,
  }
}

export type Cdr = {
  family: "Neutral"
  kind: "Cdr"
  target: Neutral
}

export function Cdr(target: Neutral): Cdr {
  return {
    family: "Neutral",
    kind: "Cdr",
    target,
  }
}

export type Dot = {
  family: "Neutral"
  kind: "Dot"
  target: Neutral
  name: string
}

export function Dot(target: Neutral, name: string): Dot {
  return {
    family: "Neutral",
    kind: "Dot",
    target,
    name,
  }
}
