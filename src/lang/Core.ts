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

export type Var = { kind: "Var"; name: string }

export function Var(name: string): Var {
  return { kind: "Var", name }
}

export type Pi = {
  kind: "Pi"
  name: string
  argType: Core
  retType: Core
}

export function Pi(name: string, argType: Core, retType: Core): Pi {
  return { kind: "Pi", name, argType, retType }
}

export type Fn = { kind: "Fn"; name: string; ret: Core }

export function Fn(name: string, ret: Core): Fn {
  return { kind: "Fn", name, ret }
}

export type Ap = { kind: "Ap"; target: Core; arg: Core }

export function Ap(target: Core, arg: Core): Ap {
  return { kind: "Ap", target, arg }
}

export type ArgKind = "plain" // | "implicit" | "vague"

export type ArgEntry = {
  kind: ArgKind
  exp: Core
}

export type MultiAp = {
  kind: "MultiAp"
  target: Core
  argEntries: Array<ArgEntry>
}

export function MultiAp(target: Core, argEntries: Array<ArgEntry>): MultiAp {
  return { kind: "MultiAp", target, argEntries }
}

export type Sigma = {
  kind: "Sigma"
  name: string
  carType: Core
  cdrType: Core
}

export function Sigma(name: string, carType: Core, cdrType: Core): Sigma {
  return { kind: "Sigma", name, carType, cdrType }
}

export type Cons = { kind: "Cons"; car: Core; cdr: Core }

export function Cons(car: Core, cdr: Core): Cons {
  return { kind: "Cons", car, cdr }
}

export type Car = { kind: "Car"; target: Core }

export function Car(target: Core): Car {
  return { kind: "Car", target }
}

export type Cdr = { kind: "Cdr"; target: Core }

export function Cdr(target: Core): Cdr {
  return { kind: "Cdr", target }
}

// NOTE We can not only use `name` we also need `realName`,
//   because of `subst` might rename bound variables.
export type Cls = ClsCons | ClsFulfilled | ClsNull

export type ClsCons = {
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
  return { kind: "ClsCons", name, realName, propertyType, rest }
}

export type ClsFulfilled = {
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
    kind: "ClsFulfilled",
    name,
    realName,
    property,
    propertyType,
    rest,
  }
}

export type ClsNull = {
  kind: "ClsNull"
}

export function ClsNull(): ClsNull {
  return { kind: "ClsNull" }
}

export type Obj = { kind: "Obj"; properties: Record<string, Core> }

export function Obj(properties: Record<string, Core>): Obj {
  return { kind: "Obj", properties }
}

export type Dot = { kind: "Dot"; target: Core; name: string }

export function Dot(target: Core, name: string): Dot {
  return { kind: "Dot", target, name }
}
