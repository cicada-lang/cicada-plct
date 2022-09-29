import { Ctx } from "../ctx"
import { Env, EnvCons, EnvNull } from "../env"
import { Var } from "../neutral"
import { TypedNeutral } from "../value"

export function ctxToEnv(ctx: Ctx): Env {
  switch (ctx.kind) {
    case "CtxNull": {
      return EnvNull()
    }

    case "CtxCons": {
      return EnvCons(ctx.name, TypedNeutral(ctx.type, Var(ctx.name)), ctxToEnv(ctx.rest))
    }

    case "CtxFulfilled": {
      return EnvCons(ctx.name, ctx.value, ctxToEnv(ctx.rest))
    }
  }
}
