export type Core =
  | Var
  | Pi
  | PiImplicit
  | Fn
  | FnImplicit
  | Ap
  | ApImplicit
  | Sigma
  | Cons
  | Car
  | Cdr
  | Quote
  | Clazz
  | Objekt
  | Dot

export type Var = {
  family: "Core"
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    family: "Core",
    kind: "Var",
    name,
  }
}

export type Pi = {
  family: "Core"
  kind: "Pi"
  name: string
  argType: Core
  retType: Core
}

export function Pi(name: string, argType: Core, retType: Core): Pi {
  return {
    family: "Core",
    kind: "Pi",
    name,
    argType,
    retType,
  }
}

export type PiImplicit = {
  family: "Core"
  kind: "PiImplicit"
  name: string
  argType: Core
  retType: Core
}

export function PiImplicit(
  name: string,
  argType: Core,
  retType: Core,
): PiImplicit {
  return {
    family: "Core",
    kind: "PiImplicit",
    name,
    argType,
    retType,
  }
}

export type Fn = {
  family: "Core"
  kind: "Fn"
  name: string
  ret: Core
}

export function Fn(name: string, ret: Core): Fn {
  return {
    family: "Core",
    kind: "Fn",
    name,
    ret,
  }
}

export type FnImplicit = {
  family: "Core"
  kind: "FnImplicit"
  name: string
  ret: Core
}

export function FnImplicit(name: string, ret: Core): FnImplicit {
  return {
    family: "Core",
    kind: "FnImplicit",
    name,
    ret,
  }
}

export type Ap = {
  family: "Core"
  kind: "Ap"
  target: Core
  arg: Core
}

export function Ap(target: Core, arg: Core): Ap {
  return {
    family: "Core",
    kind: "Ap",
    target,
    arg,
  }
}
export type ApImplicit = {
  family: "Core"
  kind: "ApImplicit"
  target: Core
  arg: Core
}

export function ApImplicit(target: Core, arg: Core): ApImplicit {
  return {
    family: "Core",
    kind: "ApImplicit",
    target,
    arg,
  }
}

export type Sigma = {
  family: "Core"
  kind: "Sigma"
  name: string
  carType: Core
  cdrType: Core
}

export function Sigma(name: string, carType: Core, cdrType: Core): Sigma {
  return {
    family: "Core",
    kind: "Sigma",
    name,
    carType,
    cdrType,
  }
}

export type Cons = {
  family: "Core"
  kind: "Cons"
  car: Core
  cdr: Core
}

export function Cons(car: Core, cdr: Core): Cons {
  return {
    family: "Core",
    kind: "Cons",
    car,
    cdr,
  }
}

export type Car = {
  family: "Core"
  kind: "Car"
  target: Core
}

export function Car(target: Core): Car {
  return {
    family: "Core",
    kind: "Car",
    target,
  }
}

export type Cdr = {
  family: "Core"
  kind: "Cdr"
  target: Core
}

export function Cdr(target: Core): Cdr {
  return {
    family: "Core",
    kind: "Cdr",
    target,
  }
}

export type Quote = {
  family: "Core"
  kind: "Quote"
  literal: string
}

export function Quote(literal: string): Quote {
  return {
    family: "Core",
    kind: "Quote",
    literal,
  }
}

/**

   ## name v.s. localName in Clazz

   We can not only use `name` we also need `localName`,
   because of `subst` might rename bound variables.

**/

export type Clazz = ClazzNull | ClazzCons | ClazzFulfilled

export type ClazzNull = {
  family: "Core"
  kind: "ClazzNull"
}

export function ClazzNull(): ClazzNull {
  return {
    family: "Core",
    kind: "ClazzNull",
  }
}

export type ClazzCons = {
  family: "Core"
  kind: "ClazzCons"
  name: string
  localName: string
  propertyType: Core
  rest: Clazz
}

export function ClazzCons(
  name: string,
  localName: string,
  propertyType: Core,
  rest: Clazz,
): ClazzCons {
  return {
    family: "Core",
    kind: "ClazzCons",
    name,
    localName,
    propertyType,
    rest,
  }
}

export type ClazzFulfilled = {
  family: "Core"
  kind: "ClazzFulfilled"
  name: string
  propertyType: Core
  property: Core
  rest: Clazz
}

export function ClazzFulfilled(
  name: string,
  propertyType: Core,
  property: Core,
  rest: Clazz,
): ClazzFulfilled {
  return {
    family: "Core",
    kind: "ClazzFulfilled",
    name,
    propertyType,
    property,
    rest,
  }
}

export type Objekt = {
  family: "Core"
  kind: "Objekt"
  properties: Record<string, Core>
}

export function Objekt(properties: Record<string, Core>): Objekt {
  return {
    family: "Core",
    kind: "Objekt",
    properties,
  }
}

export type Dot = {
  family: "Core"
  kind: "Dot"
  target: Core
  name: string
}

export function Dot(target: Core, name: string): Dot {
  return {
    family: "Core",
    kind: "Dot",
    target,
    name,
  }
}
