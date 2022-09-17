import { applyClosure } from "../closure"
import { Core, evaluate } from "../core"
import { Ctx, ctxToEnv } from "../ctx"
import * as Exps from "../exp"
import { check, Inferred } from "../exp"
import { PatternVar, Solution, solve } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function insertImplicitAp(
  patternVars: Array<PatternVar>,
  solution: Solution,
  ctx: Ctx,
  target: Core,
  type: Value,
  args: Array<Exps.Arg>,
): Inferred {
  const [arg, ...restArgs] = args

  if (arg?.kind !== "ArgPlain") {
    throw new Error("TODO")
  }

  const argInferred = Exps.inferOrUndefined(ctx, arg.exp)

  /**
       TODO Maybe we can also handle `Values.ImplicitPi`.
    **/
  Values.assertTypeInCtx(ctx, type, Values.Pi)

  if (argInferred !== undefined) {
    solution = solve(
      solution,
      ctx,
      Values.Type(),
      argInferred.type,
      type.argType,
    )
  }

  const argCore = check(ctx, arg.exp, type.argType)
  const argValue = evaluate(ctxToEnv(ctx), argCore)
  const retType = applyClosure(type.retTypeClosure, argValue)
  return insertImplicitAp(patternVars, solution, ctx, target, retType, restArgs)
}
