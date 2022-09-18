import { Core } from "../core"
import { Ctx } from "../ctx"
import { check, Exp } from "../exp"
import { Solution } from "../solution"
import * as Values from "../value"

export function checkType(solution: Solution, ctx: Ctx, type: Exp): Core {
  return check(solution, ctx, type, Values.Type())
}
