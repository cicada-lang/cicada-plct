import { Core } from "../core"
import { Ctx } from "../ctx"
import { check, Exp } from "../exp"
import * as Values from "../value"

export function checkType(ctx: Ctx, type: Exp): Core {
  return check(ctx, type, Values.Type())
}
