import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Exps from "../exp"
import { Exp, infer, Inferred } from "../exp"
import { PatternVar } from "../solution"
import { Value } from "../value"

export function insertImplicitAp(
  patternVars: Array<PatternVar>,
  ctx: Ctx,
  target: Core,
  type: Value,
  argExp: Exp,
  args: Array<Exps.Arg>,
): Inferred {
  const inferredArg = infer(ctx, argExp)

  throw new Error("TODO")
}
