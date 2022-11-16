import { check } from "../check"
import type { Core } from "../core"
import type { Ctx } from "../ctx"
import type { Exp } from "../exp"
import { Mod } from "../mod"
import * as Values from "../value"

export function checkType(mod: Mod, ctx: Ctx, type: Exp): Core {
  return check(mod, ctx, type, Values.Type())
}
