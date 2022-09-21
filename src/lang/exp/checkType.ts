import { Core } from "../core"
import { Ctx } from "../ctx"
import { check, Exp } from "../exp"
import { Mod } from "../mod"
import * as Values from "../value"

export function checkType(mod: Mod, ctx: Ctx, type: Exp): Core {
  return check(mod, ctx, type, Values.Type())
}
