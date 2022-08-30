import { Ctx } from "../ctx"
import { Value } from "../value"

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
