import { Env, EnvCons, EnvNull } from "./Env"
import { Var } from "./Neutral"
import { NotYetValue, Value } from "./Value"

export type Ctx = CtxCons | CtxFulfilled | CtxNull

export type CtxCons = {
  kind: "CtxCons"
  name: string
  type: Value
  rest: Ctx
}

export function CtxCons(name: string, type: Value, rest: Ctx): CtxCons {
  return {
    kind: "CtxCons",
    name,
    type,
    rest,
  }
}

export type CtxFulfilled = {
  kind: "CtxFulfilled"
  name: string
  type: Value
  value: Value
  rest: Ctx
}

export function CtxFulfilled(
  name: string,
  type: Value,
  value: Value,
  rest: Ctx
): CtxFulfilled {
  return {
    kind: "CtxFulfilled",
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

export function lookupCtxTypeOrFail(ctx: Ctx, name: string): Value {
  const type = lookupCtxType(ctx, name)
  if (type === undefined) {
    throw new Error(`Undefined name: ${name}`)
  }

  return type
}

export function lookupCtxType(ctx: Ctx, name: string): Value | undefined {
  switch (ctx.kind) {
    case "CtxCons": {
      if (ctx.name === name) {
        return ctx.type
      } else {
        return lookupCtxType(ctx.rest, name)
      }
    }

    case "CtxFulfilled": {
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

export function ctxToEnv(ctx: Ctx): Env {
  switch (ctx.kind) {
    case "CtxCons": {
      return EnvCons(
        ctx.name,
        NotYetValue(ctx.type, Var(ctx.name)),
        ctxToEnv(ctx.rest)
      )
    }

    case "CtxFulfilled": {
      return EnvCons(ctx.name, ctx.value, ctxToEnv(ctx.rest))
    }

    case "CtxNull": {
      return EnvNull()
    }
  }
}
