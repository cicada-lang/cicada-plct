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
  family: "Exp"
  kind: "Var"
  name: string
} & ExpMeta

export function Var(name: string, span?: Span): Var {
  return {
    family: "Exp",
    kind: "Var",
    name,
    span,
  }
}

export type Pi = {
  family: "Exp"
  kind: "Pi"
  name: string
  argType: Exp
  retType: Exp
} & ExpMeta

export function Pi(name: string, argType: Exp, retType: Exp, span?: Span): Pi {
  return {
    family: "Exp",
    kind: "Pi",
    name,
    argType,
    retType,
    span,
  }
}

export type Fn = {
  family: "Exp"
  kind: "Fn"
  name: string
  ret: Exp
} & ExpMeta

export function Fn(name: string, ret: Exp, span?: Span): Fn {
  return {
    family: "Exp",
    kind: "Fn",
    name,
    ret,
    span,
  }
}

export type Arg = ArgPlain | ArgImplicit | ArgVague

export type ArgPlain = {
  kind: "ArgPlain"
  exp: Exp
}

export function ArgPlain(exp: Exp): ArgPlain {
  return {
    kind: "ArgPlain",
    exp,
  }
}

export type ArgImplicit = {
  kind: "ArgImplicit"
  exp: Exp
}

export function ArgImplicit(exp: Exp): ArgImplicit {
  return {
    kind: "ArgImplicit",
    exp,
  }
}

export type ArgVague = {
  kind: "ArgVague"
  exp: Exp
}

export function ArgVague(exp: Exp): ArgVague {
  return {
    kind: "ArgVague",
    exp,
  }
}

export type Ap = {
  family: "Exp"
  kind: "Ap"
  target: Exp
  args: Array<Arg>
} & ExpMeta

export function Ap(target: Exp, args: Array<Arg>, span?: Span): Ap {
  return {
    family: "Exp",
    kind: "Ap",
    target,
    args,
    span,
  }
}

export type Sigma = {
  family: "Exp"
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
    family: "Exp",
    kind: "Sigma",
    name,
    carType,
    cdrType,
    span,
  }
}

export type Cons = {
  family: "Exp"
  kind: "Cons"
  car: Exp
  cdr: Exp
} & ExpMeta

export function Cons(car: Exp, cdr: Exp, span?: Span): Cons {
  return {
    family: "Exp",
    kind: "Cons",
    car,
    cdr,
    span,
  }
}

export type Car = {
  family: "Exp"
  kind: "Car"
  target: Exp
} & ExpMeta

export function Car(target: Exp, span?: Span): Car {
  return {
    family: "Exp",
    kind: "Car",
    target,
    span,
  }
}

export type Cdr = {
  family: "Exp"
  kind: "Cdr"
  target: Exp
} & ExpMeta

export function Cdr(target: Exp, span?: Span): Cdr {
  return {
    family: "Exp",
    kind: "Cdr",
    target,
    span,
  }
}

/**

   # name v.s. realName in Cls

   We can not only use `name` we also need `realName`,
   because of `subst` might rename bound variables.

*/

export type Cls = ClsCons | ClsFulfilled | ClsNull

export type ClsCons = {
  family: "Exp"
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
    family: "Exp",
    kind: "ClsCons",
    name,
    realName,
    propertyType,
    rest,
    span,
  }
}

export type ClsFulfilled = {
  family: "Exp"
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
    family: "Exp",
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
  family: "Exp"
  kind: "ClsNull"
} & ExpMeta

export function ClsNull(span?: Span): ClsNull {
  return {
    family: "Exp",
    kind: "ClsNull",
    span,
  }
}

export type Obj = {
  family: "Exp"
  kind: "Obj"
  properties: Record<string, Exp>
} & ExpMeta

export function Obj(properties: Record<string, Exp>, span?: Span): Obj {
  return {
    family: "Exp",
    kind: "Obj",
    properties,
    span,
  }
}

export type Dot = {
  family: "Exp"
  kind: "Dot"
  target: Exp
  name: string
} & ExpMeta

export function Dot(target: Exp, name: string, span?: Span): Dot {
  return {
    family: "Exp",
    kind: "Dot",
    target,
    name,
    span,
  }
}
