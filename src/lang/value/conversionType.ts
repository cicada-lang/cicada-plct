import { Ctx } from "../ctx"
import { Mod } from "../mod"
import * as Values from "../value"
import { conversion, Value } from "../value"

export function conversionType(mod: Mod, ctx: Ctx, left: Value, right: Value): void {
  conversion(mod, ctx, Values.Type(), left, right)
}
