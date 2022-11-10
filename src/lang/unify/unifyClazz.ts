import { Ctx } from "../ctx"
import { Mod } from "../mod"
import { unifyClazzOrderless } from "../unify"
import * as Values from "../value"

export function unifyClazz(
  mod: Mod,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): void {
  return unifyClazzOrderless(mod, ctx, left, right)
}
