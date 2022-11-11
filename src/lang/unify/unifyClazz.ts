import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { unifyClazzOrdered } from "../unify"
import * as Values from "../value"

export function unifyClazz(
  mod: Mod,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): void {
  return unifyClazzOrdered(mod, ctx, left, right)
}
