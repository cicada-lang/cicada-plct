import { Span } from "../exp"

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
  | PiImplicit
  | PiFolded
  | Ap
  | ApImplicit
  | ApFolded
  | Fn
  | FnAnnotated
  | FnImplicit
  | FnAnnotatedImplicit
  | FnFolded
  | FnFoldedWithRetType
  | Sigma
  | SigmaFolded
  | Cons
  | Car
  | Cdr
  | Quote
  | Clazz
  | ClazzFolded
  | Objekt
  | ObjektFolded
  | New
  | NewFolded
  | ApNew
  | Dot
  | Sequence
  | SequenceFolded

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

export type PiImplicit = {
  family: "Exp"
  kind: "PiImplicit"
  name: string
  argType: Exp
  retType: Exp
} & ExpMeta

export function PiImplicit(
  name: string,
  argType: Exp,
  retType: Exp,
  span?: Span,
): PiImplicit {
  return {
    family: "Exp",
    kind: "PiImplicit",
    name,
    argType,
    retType,
    span,
  }
}

export type PiFolded = {
  family: "Exp"
  kind: "PiFolded"
  bindings: Array<PiBinding>
  retType: Exp
} & ExpMeta

export function PiFolded(
  bindings: Array<PiBinding>,
  retType: Exp,
  span?: Span,
): PiFolded {
  return {
    family: "Exp",
    kind: "PiFolded",
    bindings,
    retType,
    span,
  }
}

export type PiBinding = PiBindingNameless | PiBindingNamed | PiBindingImplicit

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

export type PiBindingImplicit = {
  kind: "PiBindingImplicit"
  name: string
  type: Exp
}

export function PiBindingImplicit(name: string, type: Exp): PiBindingImplicit {
  return {
    kind: "PiBindingImplicit",
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

export type FnAnnotated = {
  family: "Exp"
  kind: "FnAnnotated"
  name: string
  argType: Exp
  ret: Exp
} & ExpMeta

export function FnAnnotated(
  name: string,
  argType: Exp,
  ret: Exp,
  span?: Span,
): FnAnnotated {
  return {
    family: "Exp",
    kind: "FnAnnotated",
    name,
    argType,
    ret,
    span,
  }
}

export type FnImplicit = {
  family: "Exp"
  kind: "FnImplicit"
  name: string
  ret: Exp
} & ExpMeta

export function FnImplicit(name: string, ret: Exp, span?: Span): FnImplicit {
  return {
    family: "Exp",
    kind: "FnImplicit",
    name,
    ret,
    span,
  }
}

export type FnAnnotatedImplicit = {
  family: "Exp"
  kind: "FnAnnotatedImplicit"
  name: string
  argType: Exp
  ret: Exp
} & ExpMeta

export function FnAnnotatedImplicit(
  name: string,
  argType: Exp,
  ret: Exp,
  span?: Span,
): FnAnnotatedImplicit {
  return {
    family: "Exp",
    kind: "FnAnnotatedImplicit",
    name,
    argType,
    ret,
    span,
  }
}

export type FnFolded = {
  family: "Exp"
  kind: "FnFolded"
  bindings: Array<FnBinding>
  ret: Exp
} & ExpMeta

export function FnFolded(
  bindings: Array<FnBinding>,
  ret: Exp,
  span?: Span,
): FnFolded {
  return {
    family: "Exp",
    kind: "FnFolded",
    bindings,
    ret,
    span,
  }
}

export type FnFoldedWithRetType = {
  family: "Exp"
  kind: "FnFoldedWithRetType"
  bindings: Array<FnBinding>
  retType: Exp
  ret: Exp
} & ExpMeta

export function FnFoldedWithRetType(
  bindings: Array<FnBinding>,
  retType: Exp,
  ret: Exp,
  span?: Span,
): FnFoldedWithRetType {
  return {
    family: "Exp",
    kind: "FnFoldedWithRetType",
    bindings,
    retType,
    ret,
    span,
  }
}

export type FnBinding =
  | FnBindingName
  | FnBindingAnnotated
  | FnBindingImplicit
  | FnBindingAnnotatedImplicit

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
  type: Exp,
): FnBindingAnnotated {
  return {
    kind: "FnBindingAnnotated",
    name,
    type,
  }
}

export type FnBindingImplicit = {
  kind: "FnBindingImplicit"
  name: string
}

export function FnBindingImplicit(name: string): FnBindingImplicit {
  return {
    kind: "FnBindingImplicit",
    name,
  }
}

export type FnBindingAnnotatedImplicit = {
  kind: "FnBindingAnnotatedImplicit"
  name: string
  type: Exp
}

export function FnBindingAnnotatedImplicit(
  name: string,
  type: Exp,
): FnBindingAnnotatedImplicit {
  return {
    kind: "FnBindingAnnotatedImplicit",
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

export type ApImplicit = {
  family: "Exp"
  kind: "ApImplicit"
  target: Exp
  arg: Exp
} & ExpMeta

export function ApImplicit(target: Exp, arg: Exp, span?: Span): ApImplicit {
  return {
    family: "Exp",
    kind: "ApImplicit",
    target,
    arg,
    span,
  }
}

export type ApFolded = {
  family: "Exp"
  kind: "ApFolded"
  target: Exp
  args: Array<Arg>
} & ExpMeta

export function FoldedAp(target: Exp, args: Array<Arg>, span?: Span): ApFolded {
  return {
    family: "Exp",
    kind: "ApFolded",
    target,
    args,
    span,
  }
}

export type Arg = ArgPlain | ArgImplicit

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
  span?: Span,
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

export type SigmaFolded = {
  family: "Exp"
  kind: "SigmaFolded"
  bindings: Array<SigmaBinding>
  cdrType: Exp
} & ExpMeta

export function FoldedSigma(
  bindings: Array<SigmaBinding>,
  cdrType: Exp,
  span?: Span,
): SigmaFolded {
  return {
    family: "Exp",
    kind: "SigmaFolded",
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

export type Clazz = ClazzNull | ClazzCons | ClazzFulfilled

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
  span?: Span,
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
  propertyType: Exp
  property: Exp
  rest: Clazz
} & ExpMeta

export function ClazzFulfilled(
  name: string,
  propertyType: Exp,
  property: Exp,
  rest: Clazz,
  span?: Span,
): ClazzFulfilled {
  return {
    family: "Exp",
    kind: "ClazzFulfilled",
    name,
    propertyType,
    property,
    rest,
    span,
  }
}

export type ClazzFolded = {
  family: "Exp"
  kind: "ClazzFolded"
  bindings: Array<ClazzBinding>
} & ExpMeta

export function FoldedClazz(
  bindings: Array<ClazzBinding>,
  span?: Span,
): ClazzFolded {
  return {
    family: "Exp",
    kind: "ClazzFolded",
    bindings,
    span,
  }
}

export type ClazzBinding = ClazzBindingAbstract | ClazzBindingFulfilled

export type ClazzBindingAbstract = {
  kind: "ClazzBindingAbstract"
  name: string
  propertyType: Exp
}

export function ClazzBindingAbstract(
  name: string,
  propertyType: Exp,
): ClazzBindingAbstract {
  return {
    kind: "ClazzBindingAbstract",
    name,
    propertyType,
  }
}

export type ClazzBindingFulfilled = {
  kind: "ClazzBindingFulfilled"
  name: string
  propertyType: Exp
  property: Exp
}

export function ClazzBindingFulfilled(
  name: string,
  propertyType: Exp,
  property: Exp,
): ClazzBindingFulfilled {
  return {
    kind: "ClazzBindingFulfilled",
    name,
    propertyType,
    property,
  }
}

export type Objekt = {
  family: "Exp"
  kind: "Objekt"
  properties: Record<string, Exp>
} & ExpMeta

export function Objekt(properties: Record<string, Exp>, span?: Span): Objekt {
  return {
    family: "Exp",
    kind: "Objekt",
    properties,
    span,
  }
}

export type ObjektFolded = {
  family: "Exp"
  kind: "ObjektFolded"
  properties: Array<Property>
} & ExpMeta

export function FoldedObjekt(
  properties: Array<Property>,
  span?: Span,
): ObjektFolded {
  return {
    family: "Exp",
    kind: "ObjektFolded",
    properties,
    span,
  }
}

export type Property = PropertyPlain | PropertySpread

export type PropertyPlain = {
  kind: "PropertyPlain"
  name: string
  exp: Exp
}

export function PropertyPlain(name: string, exp: Exp): PropertyPlain {
  return {
    kind: "PropertyPlain",
    name,
    exp,
  }
}

export type PropertySpread = {
  kind: "PropertySpread"
  exp: Exp
}

export function PropertySpread(exp: Exp): PropertySpread {
  return {
    kind: "PropertySpread",
    exp,
  }
}

export type New = {
  family: "Exp"
  kind: "New"
  name: string
  properties: Record<string, Exp>
} & ExpMeta

export function New(
  name: string,
  properties: Record<string, Exp>,
  span?: Span,
): New {
  return {
    family: "Exp",
    kind: "New",
    name,
    properties,
    span,
  }
}

export type NewFolded = {
  family: "Exp"
  kind: "NewFolded"
  name: string
  properties: Array<Property>
} & ExpMeta

export function NewFolded(
  name: string,
  properties: Array<Property>,
  span?: Span,
): NewFolded {
  return {
    family: "Exp",
    kind: "NewFolded",
    name,
    properties,
    span,
  }
}

export type ApNew = {
  family: "Exp"
  kind: "ApNew"
  name: string
  args: Array<Arg>
} & ExpMeta

export function ApNew(name: string, args: Array<Arg>, span?: Span): ApNew {
  return {
    family: "Exp",
    kind: "ApNew",
    name,
    args,
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

export type Sequence = SequenceLet | SequenceLetThe | SequenceCheck

export type SequenceLet = {
  family: "Exp"
  kind: "SequenceLet"
  name: string
  exp: Exp
  ret: Exp
} & ExpMeta

export function SequenceLet(
  name: string,
  exp: Exp,
  ret: Exp,
  span?: Span,
): SequenceLet {
  return {
    family: "Exp",
    kind: "SequenceLet",
    name,
    exp,
    ret,
    span,
  }
}

export type SequenceLetThe = {
  family: "Exp"
  kind: "SequenceLetThe"
  name: string
  type: Exp
  exp: Exp
  ret: Exp
} & ExpMeta

export function SequenceLetThe(
  name: string,
  type: Exp,
  exp: Exp,
  ret: Exp,
  span?: Span,
): SequenceLetThe {
  return {
    family: "Exp",
    kind: "SequenceLetThe",
    name,
    type,
    exp,
    ret,
    span,
  }
}

export type SequenceCheck = {
  family: "Exp"
  kind: "SequenceCheck"
  exp: Exp
  type: Exp
  ret: Exp
} & ExpMeta

export function SequenceCheck(
  exp: Exp,
  type: Exp,
  ret: Exp,
  span?: Span,
): SequenceCheck {
  return {
    family: "Exp",
    kind: "SequenceCheck",
    exp,
    type,
    ret,
    span,
  }
}

export type SequenceFolded = {
  family: "Exp"
  kind: "SequenceFolded"
  bindings: Array<SequenceBinding>
  ret: Exp
} & ExpMeta

export function FoldedSequence(
  bindings: Array<SequenceBinding>,
  ret: Exp,
  span?: Span,
): SequenceFolded {
  return {
    family: "Exp",
    kind: "SequenceFolded",
    bindings,
    ret,
    span,
  }
}

export type SequenceBinding =
  | SequenceBindingLet
  | SequenceBindingLetThe
  | SequenceBindingCheck

export type SequenceBindingLet = {
  kind: "SequenceBindingLet"
  name: string
  exp: Exp
}

export function SequenceBindingLet(name: string, exp: Exp): SequenceBindingLet {
  return {
    kind: "SequenceBindingLet",
    name,
    exp,
  }
}

export type SequenceBindingLetThe = {
  kind: "SequenceBindingLetThe"
  name: string
  type: Exp
  exp: Exp
}

export function SequenceBindingLetThe(
  name: string,
  type: Exp,
  exp: Exp,
): SequenceBindingLetThe {
  return {
    kind: "SequenceBindingLetThe",
    name,
    type,
    exp,
  }
}

export type SequenceBindingCheck = {
  kind: "SequenceBindingCheck"
  exp: Exp
  type: Exp
}

export function SequenceBindingCheck(
  exp: Exp,
  type: Exp,
): SequenceBindingCheck {
  return {
    kind: "SequenceBindingCheck",
    exp,
    type,
  }
}
