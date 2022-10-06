import { Closure } from "../closure"
import { Neutral } from "../neutral"

export type Value =
  | TypedNeutral
  | Type
  | Pi
  | PiImplicit
  | Fn
  | FnImplicit
  | Sigma
  | Cons
  | String
  | Quote
  | Trivial
  | Sole
  | Clazz
  | Objekt
  | Equal

export type AlreadyType = Type | Pi | PiImplicit | Sigma | String | Trivial | Clazz | Equal

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

export type Type = {
  family: "Value"
  kind: "Type"
}

export function Type(): Type {
  return {
    family: "Value",
    kind: "Type",
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

export type PiImplicit = {
  family: "Value"
  kind: "PiImplicit"
  argType: Value
  retTypeClosure: Closure
}

export function PiImplicit(argType: Value, retTypeClosure: Closure): PiImplicit {
  return {
    family: "Value",
    kind: "PiImplicit",
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

export type FnImplicit = {
  family: "Value"
  kind: "FnImplicit"
  retClosure: Closure
}

export function FnImplicit(retClosure: Closure): FnImplicit {
  return {
    family: "Value",
    kind: "FnImplicit",
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

export type Cons = {
  family: "Value"
  kind: "Cons"
  car: Value
  cdr: Value
}

export function Cons(car: Value, cdr: Value): Cons {
  return {
    family: "Value",
    kind: "Cons",
    car,
    cdr,
  }
}

export type String = {
  family: "Value"
  kind: "String"
}

export function String(): String {
  return {
    family: "Value",
    kind: "String",
  }
}

export type Quote = {
  family: "Value"
  kind: "Quote"
  data: string
}

export function Quote(data: string): Quote {
  return {
    family: "Value",
    kind: "Quote",
    data,
  }
}

export type Trivial = {
  family: "Value"
  kind: "Trivial"
}

export function Trivial(): Trivial {
  return {
    family: "Value",
    kind: "Trivial",
  }
}

export type Sole = {
  family: "Value"
  kind: "Sole"
}

export function Sole(): Sole {
  return {
    family: "Value",
    kind: "Sole",
  }
}

export type Clazz = ClazzNull | ClazzCons | ClazzFulfilled

export type ClazzNull = {
  family: "Value"
  kind: "ClazzNull"
}

export function ClazzNull(): ClazzNull {
  return {
    family: "Value",
    kind: "ClazzNull",
  }
}

export type ClazzCons = {
  family: "Value"
  kind: "ClazzCons"
  name: string
  propertyType: Value
  restClosure: Closure
}

export function ClazzCons(name: string, propertyType: Value, restClosure: Closure): ClazzCons {
  return {
    family: "Value",
    kind: "ClazzCons",
    name,
    propertyType,
    restClosure,
  }
}

export type ClazzFulfilled = {
  family: "Value"
  kind: "ClazzFulfilled"
  name: string
  propertyType: Value
  property: Value
  rest: Clazz
}

export function ClazzFulfilled(
  name: string,
  propertyType: Value,
  property: Value,
  rest: Clazz,
): ClazzFulfilled {
  return {
    family: "Value",
    kind: "ClazzFulfilled",
    name,
    propertyType,
    property,
    rest,
  }
}

export type Objekt = {
  family: "Value"
  kind: "Objekt"
  properties: Record<string, Value>
}

export function Objekt(properties: Record<string, Value>): Objekt {
  return {
    family: "Value",
    kind: "Objekt",
    properties,
  }
}

export type Equal = {
  family: "Value"
  kind: "Equal"
  type: Value
  from: Value
  to: Value
}

export function Equal(type: Value, from: Value, to: Value): Equal {
  return {
    family: "Value",
    kind: "Equal",
    type,
    from,
    to,
  }
}
