import { Ctx } from "../ctx"
import { Value } from "../value"

export function lookupTypeInCtx(ctx: Ctx, name: string): Value | undefined {
  switch (ctx.kind) {
    case "CtxNull": {
      return undefined
    }

    case "CtxCons": {
      if (ctx.name === name) {
        return ctx.type
      } else {
        return lookupTypeInCtx(ctx.rest, name)
      }
    }

    case "CtxFulfilled": {
      if (ctx.name === name) {
        return ctx.type
      } else {
        return lookupTypeInCtx(ctx.rest, name)
      }
    }
  }
}
