import { Ctx } from "../ctx"
import { includeClazzOrdered } from "../include"
import { Mod } from "../mod"
import * as Values from "../value"

export function includeClazz(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  subclazz: Values.Clazz,
): void {
  return includeClazzOrdered(mod, ctx, clazz, subclazz)
}
