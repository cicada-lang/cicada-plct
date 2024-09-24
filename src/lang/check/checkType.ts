import { check } from "../check/index.js"
import type { Core } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Exp } from "../exp/index.js"
import type { Mod } from "../mod/index.js"
import * as Values from "../value/index.js"

export function checkType(mod: Mod, ctx: Ctx, type: Exp): Core {
  return check(mod, ctx, type, Values.Type())
}
