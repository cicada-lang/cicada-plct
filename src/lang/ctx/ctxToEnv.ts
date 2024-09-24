import type { Ctx } from "../ctx/index.js"
import type { Env } from "../env/index.js"
import { EnvCons, EnvNull } from "../env/index.js"
import * as Neutrals from "../neutral/index.js"
import { TypedNeutral } from "../value/index.js"

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
