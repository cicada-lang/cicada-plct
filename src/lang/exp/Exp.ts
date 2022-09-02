import { Span } from "./Span"

type ExpMeta = { span?: Span }

/**

   # Exp

   `Exp` is very close to the concrete syntax,
   this is unlike `Core`, which is elaborated
   and aiming to have a small "core".

   For example, function with multiple arguments
   is implemented in `Exp` and elaborated to `Core`
   which does not support multiple arguments.

**/

export type Exp =
  | Var
  | Pi
  | FoldedPi
  | Ap
  | FoldedAp
  | Fn
  | FoldedFn
  | Sigma
  | FoldedSigma
  | Cons
  | Car
  | Cdr
  | Quote
  | Clazz
  | FoldedClazz
  | Objekt
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

export type FoldedPi = {
  family: "Exp"
  kind: "FoldedPi"
  bindings: Array<PiBinding>
  retType: Exp
} & ExpMeta

export function FoldedPi(
  bindings: Array<PiBinding>,
  retType: Exp,
  span?: Span
): FoldedPi {
  return {
    family: "Exp",
    kind: "FoldedPi",
    bindings,
    retType,
    span,
  }
}

export type PiBinding = PiBindingNameless | PiBindingNamed

export type PiBindingNameless = {
  kind: "PiBindingNameless"
  type: Exp
}

export function PiBindingNameless(type: Exp): PiBindingNameless {
  return {
    kind: "PiBindingNameless",
    type,
  }
}

export type PiBindingNamed = {
  kind: "PiBindingNamed"
  name: string
  type: Exp
}

export function PiBindingNamed(name: string, type: Exp): PiBindingNamed {
  return {
    kind: "PiBindingNamed",
    name,
    type,
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

export type FoldedFn = {
  family: "Exp"
  kind: "FoldedFn"
  bindings: Array<FnBinding>
  ret: Exp
} & ExpMeta

export function FoldedFn(
  bindings: Array<FnBinding>,
  ret: Exp,
  span?: Span
): FoldedFn {
  return {
    family: "Exp",
    kind: "FoldedFn",
    bindings,
    ret,
    span,
  }
}

export type FnBinding = FnBindingName | FnBindingAnnotated

export type FnBindingName = {
  kind: "FnBindingName"
  name: string
}

export function FnBindingName(name: string): FnBindingName {
  return {
    kind: "FnBindingName",
    name,
  }
}

export type FnBindingAnnotated = {
  kind: "FnBindingAnnotated"
  name: string
  type: Exp
}

export function FnBindingAnnotated(
  name: string,
  type: Exp
): FnBindingAnnotated {
  return {
    kind: "FnBindingAnnotated",
    name,
    type,
  }
}

export type Ap = {
  family: "Exp"
  kind: "Ap"
  target: Exp
  arg: Exp
} & ExpMeta

export function Ap(target: Exp, arg: Exp, span?: Span): Ap {
  return {
    family: "Exp",
    kind: "Ap",
    target,
    arg,
    span,
  }
}

export type FoldedAp = {
  family: "Exp"
  kind: "FoldedAp"
  target: Exp
  args: Array<Arg>
} & ExpMeta

export function FoldedAp(target: Exp, args: Array<Arg>, span?: Span): FoldedAp {
  return {
    family: "Exp",
    kind: "FoldedAp",
    target,
    args,
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

export type FoldedSigma = {
  family: "Exp"
  kind: "FoldedSigma"
  bindings: Array<SigmaBinding>
  cdrType: Exp
} & ExpMeta

export function FoldedSigma(
  bindings: Array<SigmaBinding>,
  cdrType: Exp,
  span?: Span
): FoldedSigma {
  return {
    family: "Exp",
    kind: "FoldedSigma",
    bindings,
    cdrType,
    span,
  }
}

export type SigmaBinding = SigmaBindingNameless | SigmaBindingNamed

export type SigmaBindingNameless = {
  kind: "SigmaBindingNameless"
  type: Exp
}

export function SigmaBindingNameless(type: Exp): SigmaBindingNameless {
  return {
    kind: "SigmaBindingNameless",
    type,
  }
}

export type SigmaBindingNamed = {
  kind: "SigmaBindingNamed"
  name: string
  type: Exp
}

export function SigmaBindingNamed(name: string, type: Exp): SigmaBindingNamed {
  return {
    kind: "SigmaBindingNamed",
    name,
    type,
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

export type Quote = {
  family: "Exp"
  kind: "Quote"
  literal: string
} & ExpMeta

export function Quote(literal: string, span?: Span): Quote {
  return {
    family: "Exp",
    kind: "Quote",
    literal,
    span,
  }
}

export type Clazz = ClazzCons | ClazzFulfilled | ClazzNull

export type ClazzCons = {
  family: "Exp"
  kind: "ClazzCons"
  name: string
  propertyType: Exp
  rest: Clazz
} & ExpMeta

export function ClazzCons(
  name: string,
  propertyType: Exp,
  rest: Clazz,
  span?: Span
): ClazzCons {
  return {
    family: "Exp",
    kind: "ClazzCons",
    name,
    propertyType,
    rest,
    span,
  }
}

export type ClazzFulfilled = {
  family: "Exp"
  kind: "ClazzFulfilled"
  name: string
  property: Exp
  propertyType: Exp
  rest: Clazz
} & ExpMeta

export function ClazzFulfilled(
  name: string,
  property: Exp,
  propertyType: Exp,
  rest: Clazz,
  span?: Span
): ClazzFulfilled {
  return {
    family: "Exp",
    kind: "ClazzFulfilled",
    name,
    property,
    propertyType,
    rest,
    span,
  }
}

export type ClazzNull = {
  family: "Exp"
  kind: "ClazzNull"
} & ExpMeta

export function ClazzNull(span?: Span): ClazzNull {
  return {
    family: "Exp",
    kind: "ClazzNull",
    span,
  }
}

export type FoldedClazz = {
  family: "Exp"
  kind: "FoldedClazz"
  bindings: Array<ClazzBinding>
} & ExpMeta

export type ClazzBinding = "TODO"

export type Objekt = ObjektCons | ObjektNull

export type ObjektCons = {
  family: "Exp"
  kind: "ObjektCons"
  name: string
  property: Exp
  rest: Objekt
} & ExpMeta

export function ObjektCons(
  name: string,
  property: Exp,
  rest: Objekt,
  span?: Span
): ObjektCons {
  return {
    family: "Exp",
    kind: "ObjektCons",
    name,
    property,
    rest,
    span,
  }
}

export type ObjektNull = {
  family: "Exp"
  kind: "ObjektNull"
} & ExpMeta

export function ObjektNull(span?: Span): ObjektNull {
  return {
    family: "Exp",
    kind: "ObjektNull",
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
