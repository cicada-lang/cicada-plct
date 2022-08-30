import { Ctx } from "../ctx"

export function ctxNames(ctx: Ctx): Array<string> {
  switch (ctx.kind) {
    case "CtxCons":
    case "CtxFulfilled": {
      return [ctx.name, ...ctxNames(ctx.rest)]
    }

    case "CtxNull": {
      return []
    }
  }
}
