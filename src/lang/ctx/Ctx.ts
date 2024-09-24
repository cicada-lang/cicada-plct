import type { Value } from "../value/index.js"

export type Ctx = CtxNull | CtxCons | CtxFulfilled

export type CtxNull = {
  "@kind": "CtxNull"
}

export function CtxNull(): CtxNull {
  return {
    "@kind": "CtxNull",
  }
}

export type CtxCons = {
  "@kind": "CtxCons"
  name: string
  type: Value
  rest: Ctx
}

export function CtxCons(name: string, type: Value, rest: Ctx): CtxCons {
  return {
    "@kind": "CtxCons",
    name,
    type,
    rest,
  }
}

export type CtxFulfilled = {
  "@kind": "CtxFulfilled"
  name: string
  type: Value
  value: Value
  rest: Ctx
}

export function CtxFulfilled(
  name: string,
  type: Value,
  value: Value,
  rest: Ctx,
): CtxFulfilled {
  return {
    "@kind": "CtxFulfilled",
    name,
    type,
    value,
    rest,
  }
}
