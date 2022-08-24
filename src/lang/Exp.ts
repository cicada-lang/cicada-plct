export type Exp =
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

export type Pi = { kind: "Pi"; name: string; argType: Exp; retType: Exp }
export type Fn = { kind: "Fn"; name: string; ret: Exp }
export type Ap = { kind: "Ap"; target: Exp; arg: Exp }

export function Pi(name: string, argType: Exp, retType: Exp): Pi {
  return { kind: "Pi", name, argType, retType }
}

export function Fn(name: string, ret: Exp): Fn {
  return { kind: "Fn", name, ret }
}

export function Ap(target: Exp, arg: Exp): Ap {
  return { kind: "Ap", target, arg }
}

export type Sigma = { kind: "Sigma"; name: string; carType: Exp; cdrType: Exp }
export type Cons = { kind: "Cons"; car: Exp; cdr: Exp }
export type Car = { kind: "Car"; target: Exp }
export type Cdr = { kind: "Cdr"; target: Exp }

export function Sigma(name: string, carType: Exp, cdrType: Exp): Sigma {
  return { kind: "Sigma", name, carType, cdrType }
}

export function Cons(car: Exp, cdr: Exp): Cons {
  return { kind: "Cons", car, cdr }
}

export function Car(target: Exp): Car {
  return { kind: "Car", target }
}

export function Cdr(target: Exp): Cdr {
  return { kind: "Cdr", target }
}

// NOTE We can not only use `name` we also need `realName`,
//   because of `subst` might rename bound variables.
export type Cls = ClsCons | ClsFulfilled | ClsNull

export type ClsCons = {
  kind: "ClsCons"
  name: string
  realName: string
  propertyType: Exp
  rest: Cls
}

export type ClsFulfilled = {
  kind: "ClsFulfilled"
  name: string
  realName: string
  property: Exp
  propertyType: Exp
  rest: Cls
}

export type ClsNull = {
  kind: "ClsNull"
}

export type Obj = { kind: "Obj"; properties: Record<string, Exp> }
export type Dot = { kind: "Dot"; target: Exp; name: string }

export function ClsCons(
  name: string,
  realName: string,
  propertyType: Exp,
  rest: Cls
): ClsCons {
  return { kind: "ClsCons", name, realName, propertyType, rest }
}

export function ClsFulfilled(
  name: string,
  realName: string,
  property: Exp,
  propertyType: Exp,
  rest: Cls
): ClsFulfilled {
  return { kind: "ClsFulfilled", name, realName, property, propertyType, rest }
}

export function ClsNull(): ClsNull {
  return { kind: "ClsNull" }
}

export function Obj(properties: Record<string, Exp>): Obj {
  return { kind: "Obj", properties }
}

export function Dot(target: Exp, name: string): Dot {
  return { kind: "Dot", target, name }
}
