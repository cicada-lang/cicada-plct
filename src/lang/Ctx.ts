import { Value } from "./Value"

export type Ctx = CtxCons | CtxFulfilled | CtxNull

export type CtxCons = {
  kind: "CtxCons"
  name: string
  t: Value
  rest: Ctx
}

export function CtxCons(name: string, t: Value, rest: Ctx): CtxCons {
  return {
    kind: "CtxCons",
    name,
    t,
    rest,
  }
}

export type CtxFulfilled = {
  kind: "CtxFulfilled"
  name: string
  t: Value
  value: Value
  rest: Ctx
}

export function CtxFulfilled(
  name: string,
  t: Value,
  value: Value,
  rest: Ctx
): CtxFulfilled {
  return {
    kind: "CtxFulfilled",
    name,
    t,
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

export function lookupCtxType(ctx: Ctx, name: string): Value | undefined {
  switch (ctx.kind) {
    case "CtxCons": {
      if (ctx.name === name) {
        return ctx.t
      } else {
        return lookupCtxType(ctx.rest, name)
      }
    }

    case "CtxFulfilled": {
      if (ctx.name === name) {
        return ctx.t
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

    case "CtxFulfilled": {
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
