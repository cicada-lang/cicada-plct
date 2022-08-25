import { Span } from "./Span"

type ExpMeta = { span?: Span }

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

export type Var = {
  type: "Exp"
  kind: "Var"
  name: string
} & ExpMeta

export function Var(name: string, span?: Span): Var {
  return {
    type: "Exp",
    kind: "Var",
    name,
    span,
  }
}

export type Pi = {
  type: "Exp"
  kind: "Pi"
  name: string
  argType: Exp
  retType: Exp
} & ExpMeta

export function Pi(name: string, argType: Exp, retType: Exp, span?: Span): Pi {
  return {
    type: "Exp",
    kind: "Pi",
    name,
    argType,
    retType,
    span,
  }
}

export type Fn = {
  type: "Exp"
  kind: "Fn"
  name: string
  ret: Exp
} & ExpMeta

export function Fn(name: string, ret: Exp, span?: Span): Fn {
  return {
    type: "Exp",
    kind: "Fn",
    name,
    ret,
    span,
  }
}

export type ArgKind = "plain" // | "implicit" | "vague"

export type ArgEntry = {
  kind: ArgKind
  exp: Exp
}

export type Ap = {
  type: "Exp"
  kind: "Ap"
  target: Exp
  argEntries: Array<ArgEntry>
} & ExpMeta

export function Ap(target: Exp, argEntries: Array<ArgEntry>, span?: Span): Ap {
  return {
    type: "Exp",
    kind: "Ap",
    target,
    argEntries,
    span,
  }
}

export type Sigma = {
  type: "Exp"
  kind: "Sigma"
  name: string
  carType: Exp
  cdrType: Exp
} & ExpMeta

export function Sigma(
  name: string,
  carType: Exp,
  cdrType: Exp,
  span?: Span
): Sigma {
  return {
    type: "Exp",
    kind: "Sigma",
    name,
    carType,
    cdrType,
    span,
  }
}

export type Cons = {
  type: "Exp"
  kind: "Cons"
  car: Exp
  cdr: Exp
} & ExpMeta

export function Cons(car: Exp, cdr: Exp, span?: Span): Cons {
  return {
    type: "Exp",
    kind: "Cons",
    car,
    cdr,
    span,
  }
}

export type Car = {
  type: "Exp"
  kind: "Car"
  target: Exp
} & ExpMeta

export function Car(target: Exp, span?: Span): Car {
  return {
    type: "Exp",
    kind: "Car",
    target,
    span,
  }
}

export type Cdr = {
  type: "Exp"
  kind: "Cdr"
  target: Exp
} & ExpMeta

export function Cdr(target: Exp, span?: Span): Cdr {
  return {
    type: "Exp",
    kind: "Cdr",
    target,
    span,
  }
}

// NOTE We can not only use `name` we also need `realName`,
//   because of `subst` might rename bound variables.
export type Cls = ClsCons | ClsFulfilled | ClsNull

export type ClsCons = {
  type: "Exp"
  kind: "ClsCons"
  name: string
  realName: string
  propertyType: Exp
  rest: Cls
} & ExpMeta

export function ClsCons(
  name: string,
  realName: string,
  propertyType: Exp,
  rest: Cls,
  span?: Span
): ClsCons {
  return {
    type: "Exp",
    kind: "ClsCons",
    name,
    realName,
    propertyType,
    rest,
    span,
  }
}

export type ClsFulfilled = {
  type: "Exp"
  kind: "ClsFulfilled"
  name: string
  realName: string
  property: Exp
  propertyType: Exp
  rest: Cls
} & ExpMeta

export function ClsFulfilled(
  name: string,
  realName: string,
  property: Exp,
  propertyType: Exp,
  rest: Cls,
  span?: Span
): ClsFulfilled {
  return {
    type: "Exp",
    kind: "ClsFulfilled",
    name,
    realName,
    property,
    propertyType,
    rest,
    span,
  }
}

export type ClsNull = {
  type: "Exp"
  kind: "ClsNull"
} & ExpMeta

export function ClsNull(span?: Span): ClsNull {
  return {
    type: "Exp",
    kind: "ClsNull",
    span,
  }
}

export type Obj = {
  type: "Exp"
  kind: "Obj"
  properties: Record<string, Exp>
} & ExpMeta

export function Obj(properties: Record<string, Exp>, span?: Span): Obj {
  return {
    type: "Exp",
    kind: "Obj",
    properties,
    span,
  }
}

export type Dot = {
  type: "Exp"
  kind: "Dot"
  target: Exp
  name: string
} & ExpMeta

export function Dot(target: Exp, name: string, span?: Span): Dot {
  return {
    type: "Exp",
    kind: "Dot",
    target,
    name,
    span,
  }
}
