import type { Ctx } from "../ctx"
import type { Env } from "../env"
import { EnvCons, EnvNull } from "../env"
import * as Neutrals from "../neutral"
import { TypedNeutral } from "../value"

export function ctxToEnv(ctx: Ctx): Env {
  switch (ctx["@kind"]) {
    case "CtxNull": {
      return EnvNull()
    }

    case "CtxCons": {
      return EnvCons(
        ctx.name,
        TypedNeutral(ctx.type, Neutrals.Var(ctx.name)),
        ctxToEnv(ctx.rest),
      )
    }

    case "CtxFulfilled": {
      return EnvCons(ctx.name, ctx.value, ctxToEnv(ctx.rest))
    }
  }
}
