import { Ctx } from "../ctx"
import { includeClazzOrderless } from "../include"
import { Mod } from "../mod"
import * as Values from "../value"

export function includeClazz(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  subclazz: Values.Clazz,
): void {
  return includeClazzOrderless(mod, ctx, clazz, subclazz)
}
