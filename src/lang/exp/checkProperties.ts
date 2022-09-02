import { Core } from "../core"
import { Ctx } from "../ctx"
import { Exp } from "../exp"
import * as Values from "../value"

export function checkProperties(
  ctx: Ctx,
  properties: Record<string, Exp>,
  clazz: Values.Clazz
): Record<string, Core> {
  throw new Error()
}
