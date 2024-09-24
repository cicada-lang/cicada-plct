import type { Ctx } from "../ctx/index.js"

export function ctxNames(ctx: Ctx, names: Array<string> = []): Array<string> {
  while (ctx["@kind"] !== "CtxNull") {
    names.unshift(ctx.name)
    ctx = ctx.rest
  }

  return names
}
