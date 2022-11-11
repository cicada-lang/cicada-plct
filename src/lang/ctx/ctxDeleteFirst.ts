import { Ctx } from "../ctx"

export function ctxDeleteFirst(ctx: Ctx, name: string): Ctx {
  switch (ctx.kind) {
    case "CtxNull": {
      return ctx
    }

    case "CtxCons": {
      if (ctx.name === name) {
        return ctx.rest
      } else {
        return ctxDeleteFirst(ctx.rest, name)
      }
    }

    case "CtxFulfilled": {
      if (ctx.name === name) {
        return ctx.rest
      } else {
        return ctxDeleteFirst(ctx.rest, name)
      }
    }
  }
}
