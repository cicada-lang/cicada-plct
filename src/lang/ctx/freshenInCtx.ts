import { Ctx, ctxNames } from "../ctx"
import { freshen } from "../utils/freshen"

export function freshenInCtx(ctx: Ctx, name: string): string {
  const names = ctxNames(ctx)
  return freshen(new Set(names), name)
}
