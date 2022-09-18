import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, ctxNames } from "../ctx"
import { check, Exp } from "../exp"
import * as Neutrals from "../neutral"
import { Solution } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"

export function insertImplicitFn(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
  type: Values.ImplicitPi,
): Core {
  const name = type.retTypeClosure.name
  const freshName = freshen(ctxNames(ctx), name)
  const variable = Neutrals.Var(freshName)
  const arg = Values.TypedNeutral(type.argType, variable)
  const retType = applyClosure(type.retTypeClosure, arg)
  /**
     TODO Scope BUG, the `freshName` might occurs in `exp`.
  **/
  return Cores.ImplicitFn(freshName, check(solution, ctx, exp, retType))
}
