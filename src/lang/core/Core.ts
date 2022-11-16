export type Core =
  | Var
  | MetaVar
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
  | Replace

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

export type MetaVar = {
  family: "Core"
  kind: "MetaVar"
  name: string
}

export function MetaVar(name: string): MetaVar {
  return {
    family: "Core",
    kind: "MetaVar",
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
  data: string
}

export function Quote(data: string): Quote {
  return {
    family: "Core",
    kind: "Quote",
    data,
  }
}

/**

   ## name v.s. localName in Clazz

   We can not only use `name`, we also need `localName`,
   because during `readback` bound variables might be renamed.

**/

export type Clazz = ClazzNull | ClazzCons | ClazzFulfilled

export type ClazzNull = {
  family: "Core"
  kind: "ClazzNull"
  name?: string
}

export function ClazzNull(name?: string): ClazzNull {
  return {
    family: "Core",
    kind: "ClazzNull",
    name,
  }
}

export type ClazzCons = {
  family: "Core"
  kind: "ClazzCons"
  propertyName: string
  localName: string
  propertyType: Core
  rest: Clazz
  name?: string
}

export function ClazzCons(
  propertyName: string,
  localName: string,
  propertyType: Core,
  rest: Clazz,
  name?: string,
): ClazzCons {
  return {
    family: "Core",
    kind: "ClazzCons",
    propertyName,
    localName,
    propertyType,
    rest,
    name,
  }
}

export type ClazzFulfilled = {
  family: "Core"
  kind: "ClazzFulfilled"
  propertyName: string
  propertyType: Core
  property: Core
  rest: Clazz
  name?: string
}

export function ClazzFulfilled(
  propertyName: string,
  propertyType: Core,
  property: Core,
  rest: Clazz,
  name?: string,
): ClazzFulfilled {
  return {
    family: "Core",
    kind: "ClazzFulfilled",
    propertyName,
    propertyType,
    property,
    rest,
    name,
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

export type Replace = {
  family: "Core"
  kind: "Replace"
  target: Core
  motive: Core
  base: Core
}

export function Replace(target: Core, motive: Core, base: Core): Replace {
  return {
    family: "Core",
    kind: "Replace",
    target,
    motive,
    base,
  }
}
