import { Ctx } from "../ctx"

export function ctxNames(ctx: Ctx, names: Array<string> = []): Array<string> {
  while (ctx.kind !== "CtxNull") {
    names.unshift(ctx.name)
    ctx = ctx.rest
  }

  return names
}
