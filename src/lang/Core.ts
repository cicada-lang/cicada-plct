export type Core =
  | Var
  | Global
  | Pi
  | Ap
  | Fn
  | Sigma
  | Cons
  | Car
  | Cdr
  | Cls
  | Obj
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

export type Global = {
  family: "Core"
  kind: "Global"
  name: string
}

export function Global(name: string): Global {
  return {
    family: "Core",
    kind: "Global",
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

// NOTE We can not only use `name` we also need `realName`,
//   because of `subst` might rename bound variables.
export type Cls = ClsCons | ClsFulfilled | ClsNull

export type ClsCons = {
  family: "Core"
  kind: "ClsCons"
  name: string
  realName: string
  propertyType: Core
  rest: Cls
}

export function ClsCons(
  name: string,
  realName: string,
  propertyType: Core,
  rest: Cls
): ClsCons {
  return {
    family: "Core",
    kind: "ClsCons",
    name,
    realName,
    propertyType,
    rest,
  }
}

export type ClsFulfilled = {
  family: "Core"
  kind: "ClsFulfilled"
  name: string
  realName: string
  property: Core
  propertyType: Core
  rest: Cls
}

export function ClsFulfilled(
  name: string,
  realName: string,
  property: Core,
  propertyType: Core,
  rest: Cls
): ClsFulfilled {
  return {
    family: "Core",
    kind: "ClsFulfilled",
    name,
    realName,
    property,
    propertyType,
    rest,
  }
}

export type ClsNull = {
  family: "Core"
  kind: "ClsNull"
}

export function ClsNull(): ClsNull {
  return {
    family: "Core",
    kind: "ClsNull",
  }
}

export type Obj = {
  family: "Core"
  kind: "Obj"
  properties: Record<string, Core>
}

export function Obj(properties: Record<string, Core>): Obj {
  return {
    family: "Core",
    kind: "Obj",
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
