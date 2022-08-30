import { Env, EnvCons, EnvNull } from "../env"
import { Var } from "../neutral"
import { TypedNeutral, Value } from "../value"

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

export function ctxToEnv(ctx: Ctx): Env {
  switch (ctx.kind) {
    case "CtxCons": {
      return EnvCons(
        ctx.name,
        TypedNeutral(ctx.type, Var(ctx.name)),
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
