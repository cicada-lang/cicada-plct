import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { EquationError } from "../errors"
import * as Neutrals from "../neutral"
import { Solution, solve, solveClazz, solveNeutral } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { isClazz, Value } from "../value"

export function solveType(
  solution: Solution,
  ctx: Ctx,
  left: Value,
  right: Value,
): Solution {
  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    return solveNeutral(solution, ctx, left.neutral, right.neutral)
  }

  if (left.kind === "Type" && right.kind === "Type") {
    return solution
  }

  if (left.kind === "String" && right.kind === "String") {
    return solution
  }

  if (left.kind === "Trivial" && right.kind === "Trivial") {
    return solution
  }

  if (left.kind === "Pi" && right.kind === "Pi") {
    solution = solve(solution, ctx, Values.Type(), left.argType, right.argType)
    const name = right.retTypeClosure.name
    const argType = right.argType

    const freshName = freshen(new Set(ctxNames(ctx)), name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(argType, variable)

    ctx = CtxCons(freshName, argType, ctx)

    solution = solve(
      solution,
      ctx,
      Values.Type(),
      applyClosure(right.retTypeClosure, typedNeutral),
      applyClosure(left.retTypeClosure, typedNeutral),
    )

    return solution
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    solution = solve(solution, ctx, Values.Type(), left.carType, right.carType)
    const name = right.cdrTypeClosure.name
    const carType = right.carType

    const freshName = freshen(new Set(ctxNames(ctx)), name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(carType, variable)

    ctx = CtxCons(freshName, carType, ctx)

    solution = solve(
      solution,
      ctx,
      Values.Type(),
      applyClosure(right.cdrTypeClosure, typedNeutral),
      applyClosure(left.cdrTypeClosure, typedNeutral),
    )

    return solution
  }

  if (isClazz(left) && isClazz(right)) {
    return solveClazz(solution, ctx, left, right)
  }

  throw new EquationError(
    `solveType is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
