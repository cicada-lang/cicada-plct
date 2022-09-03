import { Ctx } from "../ctx"
import { Value } from "../value"

export function lookupValueInCtx(ctx: Ctx, name: string): Value | undefined {
  switch (ctx.kind) {
    case "CtxNull": {
      return undefined
    }

    case "CtxCons": {
      if (ctx.name === name) {
        return undefined
      } else {
        return lookupValueInCtx(ctx.rest, name)
      }
    }

    case "CtxFulfilled": {
      if (ctx.name === name) {
        return ctx.value
      } else {
        return lookupValueInCtx(ctx.rest, name)
      }
    }
  }
}
