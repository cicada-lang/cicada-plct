import { Exp } from "../exp"

export type Core =
  | Var
  | Pi
  | Ap
  | Fn
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

export type Clazz = ClazzCons | ClazzFulfilled | ClazzNull

export type ClazzCons = {
  family: "Core"
  kind: "ClazzCons"
  name: string
  realName: string
  propertyType: Core
  rest: Clazz
}

export function ClazzCons(
  name: string,
  realName: string,
  propertyType: Core,
  rest: Clazz
): ClazzCons {
  return {
    family: "Core",
    kind: "ClazzCons",
    name,
    realName,
    propertyType,
    rest,
  }
}

export type ClazzFulfilled = {
  family: "Core"
  kind: "ClazzFulfilled"
  name: string
  realName: string
  property: Core
  propertyType: Core
  rest: Clazz
}

export function ClazzFulfilled(
  name: string,
  realName: string,
  property: Core,
  propertyType: Core,
  rest: Clazz
): ClazzFulfilled {
  return {
    family: "Core",
    kind: "ClazzFulfilled",
    name,
    realName,
    property,
    propertyType,
    rest,
  }
}

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

export type Objekt = ObjektCons | ObjektNull

export type ObjektCons = {
  family: "Exp"
  kind: "ObjektCons"
  name: string
  realName: string
  property: Exp
  rest: Objekt
}

export function ObjektCons(
  name: string,
  realName: string,
  property: Exp,
  rest: Objekt
): ObjektCons {
  return {
    family: "Exp",
    kind: "ObjektCons",
    name,
    realName,
    property,
    rest,
  }
}

export type ObjektNull = {
  family: "Exp"
  kind: "ObjektNull"
}

export function ObjektNull(): ObjektNull {
  return {
    family: "Exp",
    kind: "ObjektNull",
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
