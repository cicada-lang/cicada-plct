export type Core =
  | Var
  | PatternVar
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
  "@type": "Core"
  "@kind": "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    "@type": "Core",
    "@kind": "Var",
    name,
  }
}

export type PatternVar = {
  "@type": "Core"
  "@kind": "PatternVar"
  name: string
}

export function PatternVar(name: string): PatternVar {
  return {
    "@type": "Core",
    "@kind": "PatternVar",
    name,
  }
}

export type Pi = {
  "@type": "Core"
  "@kind": "Pi"
  name: string
  argType: Core
  retType: Core
}

export function Pi(name: string, argType: Core, retType: Core): Pi {
  return {
    "@type": "Core",
    "@kind": "Pi",
    name,
    argType,
    retType,
  }
}

export type PiImplicit = {
  "@type": "Core"
  "@kind": "PiImplicit"
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
    "@type": "Core",
    "@kind": "PiImplicit",
    name,
    argType,
    retType,
  }
}

export type Fn = {
  "@type": "Core"
  "@kind": "Fn"
  name: string
  ret: Core
}

export function Fn(name: string, ret: Core): Fn {
  return {
    "@type": "Core",
    "@kind": "Fn",
    name,
    ret,
  }
}

export type FnImplicit = {
  "@type": "Core"
  "@kind": "FnImplicit"
  name: string
  ret: Core
}

export function FnImplicit(name: string, ret: Core): FnImplicit {
  return {
    "@type": "Core",
    "@kind": "FnImplicit",
    name,
    ret,
  }
}

export type Ap = {
  "@type": "Core"
  "@kind": "Ap"
  target: Core
  arg: Core
}

export function Ap(target: Core, arg: Core): Ap {
  return {
    "@type": "Core",
    "@kind": "Ap",
    target,
    arg,
  }
}
export type ApImplicit = {
  "@type": "Core"
  "@kind": "ApImplicit"
  target: Core
  arg: Core
}

export function ApImplicit(target: Core, arg: Core): ApImplicit {
  return {
    "@type": "Core",
    "@kind": "ApImplicit",
    target,
    arg,
  }
}

export type Sigma = {
  "@type": "Core"
  "@kind": "Sigma"
  name: string
  carType: Core
  cdrType: Core
}

export function Sigma(name: string, carType: Core, cdrType: Core): Sigma {
  return {
    "@type": "Core",
    "@kind": "Sigma",
    name,
    carType,
    cdrType,
  }
}

export type Cons = {
  "@type": "Core"
  "@kind": "Cons"
  car: Core
  cdr: Core
}

export function Cons(car: Core, cdr: Core): Cons {
  return {
    "@type": "Core",
    "@kind": "Cons",
    car,
    cdr,
  }
}

export type Car = {
  "@type": "Core"
  "@kind": "Car"
  target: Core
}

export function Car(target: Core): Car {
  return {
    "@type": "Core",
    "@kind": "Car",
    target,
  }
}

export type Cdr = {
  "@type": "Core"
  "@kind": "Cdr"
  target: Core
}

export function Cdr(target: Core): Cdr {
  return {
    "@type": "Core",
    "@kind": "Cdr",
    target,
  }
}

export type Quote = {
  "@type": "Core"
  "@kind": "Quote"
  data: string
}

export function Quote(data: string): Quote {
  return {
    "@type": "Core",
    "@kind": "Quote",
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
  "@type": "Core"
  "@kind": "ClazzNull"
  name?: string
}

export function ClazzNull(name?: string): ClazzNull {
  return {
    "@type": "Core",
    "@kind": "ClazzNull",
    name,
  }
}

export type ClazzCons = {
  "@type": "Core"
  "@kind": "ClazzCons"
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
    "@type": "Core",
    "@kind": "ClazzCons",
    propertyName,
    localName,
    propertyType,
    rest,
    name,
  }
}

export type ClazzFulfilled = {
  "@type": "Core"
  "@kind": "ClazzFulfilled"
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
    "@type": "Core",
    "@kind": "ClazzFulfilled",
    propertyName,
    propertyType,
    property,
    rest,
    name,
  }
}

export type Objekt = {
  "@type": "Core"
  "@kind": "Objekt"
  properties: Record<string, Core>
}

export function Objekt(properties: Record<string, Core>): Objekt {
  return {
    "@type": "Core",
    "@kind": "Objekt",
    properties,
  }
}

export type Dot = {
  "@type": "Core"
  "@kind": "Dot"
  target: Core
  name: string
}

export function Dot(target: Core, name: string): Dot {
  return {
    "@type": "Core",
    "@kind": "Dot",
    target,
    name,
  }
}

export type Replace = {
  "@type": "Core"
  "@kind": "Replace"
  target: Core
  motive: Core
  base: Core
}

export function Replace(target: Core, motive: Core, base: Core): Replace {
  return {
    "@type": "Core",
    "@kind": "Replace",
    target,
    motive,
    base,
  }
}
