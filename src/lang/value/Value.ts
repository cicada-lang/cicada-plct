import type { Closure } from "../closure"
import type { Neutral } from "../neutral"
import * as Neutrals from "../neutral"

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
  | Refl

export type AlreadyType =
  | Type
  | Pi
  | PiImplicit
  | Sigma
  | String
  | Trivial
  | Clazz
  | Equal

export type PatternVar = TypedNeutral & {
  neutral: Neutrals.PatternVar
}

export function PatternVar(type: Value, name: string): PatternVar {
  return TypedNeutral(type, Neutrals.PatternVar(name)) as PatternVar
}

export function isPatternVar(value: Value): value is PatternVar {
  return (
    value["@kind"] === "TypedNeutral" && value.neutral["@kind"] === "PatternVar"
  )
}

export type TypedNeutral = {
  "@type": "Value"
  "@kind": "TypedNeutral"
  type: Value
  neutral: Neutral
}

export function TypedNeutral(type: Value, neutral: Neutral): TypedNeutral {
  return {
    "@type": "Value",
    "@kind": "TypedNeutral",
    type,
    neutral,
  }
}

export type Type = {
  "@type": "Value"
  "@kind": "Type"
}

export function Type(): Type {
  return {
    "@type": "Value",
    "@kind": "Type",
  }
}

export type Pi = {
  "@type": "Value"
  "@kind": "Pi"
  argType: Value
  retTypeClosure: Closure
}

export function Pi(argType: Value, retTypeClosure: Closure): Pi {
  return {
    "@type": "Value",
    "@kind": "Pi",
    argType,
    retTypeClosure,
  }
}

export type PiImplicit = {
  "@type": "Value"
  "@kind": "PiImplicit"
  argType: Value
  retTypeClosure: Closure
}

export function PiImplicit(
  argType: Value,
  retTypeClosure: Closure,
): PiImplicit {
  return {
    "@type": "Value",
    "@kind": "PiImplicit",
    argType,
    retTypeClosure,
  }
}

export type Fn = {
  "@type": "Value"
  "@kind": "Fn"
  retClosure: Closure
}

export function Fn(retClosure: Closure): Fn {
  return {
    "@type": "Value",
    "@kind": "Fn",
    retClosure,
  }
}

export type FnImplicit = {
  "@type": "Value"
  "@kind": "FnImplicit"
  retClosure: Closure
}

export function FnImplicit(retClosure: Closure): FnImplicit {
  return {
    "@type": "Value",
    "@kind": "FnImplicit",
    retClosure,
  }
}

export type Sigma = {
  "@type": "Value"
  "@kind": "Sigma"
  carType: Value
  cdrTypeClosure: Closure
}

export function Sigma(carType: Value, cdrTypeClosure: Closure): Sigma {
  return {
    "@type": "Value",
    "@kind": "Sigma",
    carType,
    cdrTypeClosure,
  }
}

export type Cons = {
  "@type": "Value"
  "@kind": "Cons"
  car: Value
  cdr: Value
}

export function Cons(car: Value, cdr: Value): Cons {
  return {
    "@type": "Value",
    "@kind": "Cons",
    car,
    cdr,
  }
}

export type String = {
  "@type": "Value"
  "@kind": "String"
}

export function String(): String {
  return {
    "@type": "Value",
    "@kind": "String",
  }
}

export type Quote = {
  "@type": "Value"
  "@kind": "Quote"
  data: string
}

export function Quote(data: string): Quote {
  return {
    "@type": "Value",
    "@kind": "Quote",
    data,
  }
}

export type Trivial = {
  "@type": "Value"
  "@kind": "Trivial"
}

export function Trivial(): Trivial {
  return {
    "@type": "Value",
    "@kind": "Trivial",
  }
}

export type Sole = {
  "@type": "Value"
  "@kind": "Sole"
}

export function Sole(): Sole {
  return {
    "@type": "Value",
    "@kind": "Sole",
  }
}

export type Clazz = ClazzNull | ClazzCons | ClazzFulfilled

export type ClazzNull = {
  "@type": "Value"
  "@kind": "ClazzNull"
  name?: string
}

export function ClazzNull(name?: string): ClazzNull {
  return {
    "@type": "Value",
    "@kind": "ClazzNull",
    name,
  }
}

export type ClazzCons = {
  "@type": "Value"
  "@kind": "ClazzCons"
  propertyName: string
  propertyType: Value
  restClosure: Closure
  name?: string
}

export function ClazzCons(
  propertyName: string,
  propertyType: Value,
  restClosure: Closure,
  name?: string,
): ClazzCons {
  return {
    "@type": "Value",
    "@kind": "ClazzCons",
    propertyName,
    propertyType,
    restClosure,
    name,
  }
}

export type ClazzFulfilled = {
  "@type": "Value"
  "@kind": "ClazzFulfilled"
  propertyName: string
  propertyType: Value
  property: Value
  rest: Clazz
  name?: string
}

export function ClazzFulfilled(
  propertyName: string,
  propertyType: Value,
  property: Value,
  rest: Clazz,
  name?: string,
): ClazzFulfilled {
  return {
    "@type": "Value",
    "@kind": "ClazzFulfilled",
    propertyName,
    propertyType,
    property,
    rest,
    name,
  }
}

export type Objekt = {
  "@type": "Value"
  "@kind": "Objekt"
  properties: Record<string, Value>
}

export function Objekt(properties: Record<string, Value>): Objekt {
  return {
    "@type": "Value",
    "@kind": "Objekt",
    properties,
  }
}

export type Equal = {
  "@type": "Value"
  "@kind": "Equal"
  type: Value
  from: Value
  to: Value
}

export function Equal(type: Value, from: Value, to: Value): Equal {
  return {
    "@type": "Value",
    "@kind": "Equal",
    type,
    from,
    to,
  }
}

export type Refl = {
  "@type": "Value"
  "@kind": "Refl"
  type: Value
  value: Value
}

export function Refl(type: Value, value: Value): Refl {
  return {
    "@type": "Value",
    "@kind": "Refl",
    type,
    value,
  }
}
