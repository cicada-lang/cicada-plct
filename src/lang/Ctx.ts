import { Value } from "./Value"
import { Type } from "./Type"

export type Ctx = CtxCons | CtxConsValue | CtxNull

export type CtxCons = {
  kind: "CtxCons"
  name: string
  type: Type
  rest: Ctx
}

export function CtxCons(name: string, type: Type, rest: Ctx): CtxCons {
  return {
    kind: "CtxCons",
    name,
    type,
    rest,
  }
}

export type CtxConsValue = {
  kind: "CtxConsValue"
  name: string
  type: Type
  value: Value
  rest: Ctx
}

export function CtxConsValue(name: string, type: Type, value: Value, rest: Ctx): CtxConsValue {
  return {
    kind: "CtxConsValue",
    name,
    type,
    value,
    rest,
  }
}

export type CtxNull = {
  kind: "CtxNull"
}

export function CtxNull(): CtxNull {
  return {
    kind: "CtxNull",
  }
}

export function lookupCtxType(ctx: Ctx, name: string): Type | undefined {
  switch (ctx.kind) {
    case "CtxCons": {
      if (ctx.name === name) {
        return ctx.type
      } else {
        return lookupCtxType(ctx.rest, name)
      }
    }

    case "CtxConsValue": {
      if (ctx.name === name) {
        return ctx.type
      } else {
        return lookupCtxType(ctx.rest, name)
      }
    }

    case "CtxNull": {
      return undefined
    }
  }
}

export function lookupCtxValue(ctx: Ctx, name: string): Value | undefined {
  switch (ctx.kind) {
    case "CtxCons": {
      if (ctx.name === name) {
        return undefined
      } else {
        return lookupCtxValue(ctx.rest, name)
      }
    }

    case "CtxConsValue": {
      if (ctx.name === name) {
        return ctx.value
      } else {
        return lookupCtxValue(ctx.rest, name)
      }
    }

    case "CtxNull": {
      return undefined
    }
  }
}