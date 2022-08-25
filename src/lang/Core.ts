export type Core =
  | Var
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
  type: "Core"
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    type: "Core",
    kind: "Var",
    name,
  }
}

export type Pi = {
  type: "Core"
  kind: "Pi"
  name: string
  argType: Core
  retType: Core
}

export function Pi(name: string, argType: Core, retType: Core): Pi {
  return {
    type: "Core",
    kind: "Pi",
    name,
    argType,
    retType,
  }
}

export type Fn = {
  type: "Core"
  kind: "Fn"
  name: string
  ret: Core
}

export function Fn(name: string, ret: Core): Fn {
  return {
    type: "Core",
    kind: "Fn",
    name,
    ret,
  }
}

export type Ap = {
  type: "Core"
  kind: "Ap"
  target: Core
  arg: Core
}

export function Ap(target: Core, arg: Core): Ap {
  return {
    type: "Core",
    kind: "Ap",
    target,
    arg,
  }
}

export type Sigma = {
  type: "Core"
  kind: "Sigma"
  name: string
  carType: Core
  cdrType: Core
}

export function Sigma(name: string, carType: Core, cdrType: Core): Sigma {
  return {
    type: "Core",
    kind: "Sigma",
    name,
    carType,
    cdrType,
  }
}

export type Cons = {
  type: "Core"
  kind: "Cons"
  car: Core
  cdr: Core
}

export function Cons(car: Core, cdr: Core): Cons {
  return {
    type: "Core",
    kind: "Cons",
    car,
    cdr,
  }
}

export type Car = {
  type: "Core"
  kind: "Car"
  target: Core
}

export function Car(target: Core): Car {
  return {
    type: "Core",
    kind: "Car",
    target,
  }
}

export type Cdr = {
  type: "Core"
  kind: "Cdr"
  target: Core
}

export function Cdr(target: Core): Cdr {
  return {
    type: "Core",
    kind: "Cdr",
    target,
  }
}

// NOTE We can not only use `name` we also need `realName`,
//   because of `subst` might rename bound variables.
export type Cls = ClsCons | ClsFulfilled | ClsNull

export type ClsCons = {
  type: "Core"
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
    type: "Core",
    kind: "ClsCons",
    name,
    realName,
    propertyType,
    rest,
  }
}

export type ClsFulfilled = {
  type: "Core"
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
    type: "Core",
    kind: "ClsFulfilled",
    name,
    realName,
    property,
    propertyType,
    rest,
  }
}

export type ClsNull = {
  type: "Core"
  kind: "ClsNull"
}

export function ClsNull(): ClsNull {
  return {
    type: "Core",
    kind: "ClsNull",
  }
}

export type Obj = {
  type: "Core"
  kind: "Obj"
  properties: Record<string, Core>
}

export function Obj(properties: Record<string, Core>): Obj {
  return {
    type: "Core",
    kind: "Obj",
    properties,
  }
}

export type Dot = {
  type: "Core"
  kind: "Dot"
  target: Core
  name: string
}

export function Dot(target: Core, name: string): Dot {
  return {
    type: "Core",
    kind: "Dot",
    target,
    name,
  }
}
