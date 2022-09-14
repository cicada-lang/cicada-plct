import { applyClosure } from "../closure"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import { Solution } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function solveType(
  solution: Solution,
  ctx: Ctx,
  left: Value,
  right: Value,
): Solution {
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
    solution = solveType(solution, ctx, left.argType, right.argType)
    const name = right.retTypeClosure.name
    const argType = right.argType

    const freshName = freshenInCtx(ctx, name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(argType, variable)

    ctx = CtxCons(freshName, argType, ctx)

    solution = solveType(
      solution,
      ctx,
      applyClosure(right.retTypeClosure, typedNeutral),
      applyClosure(left.retTypeClosure, typedNeutral),
    )

    return solution
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    solution = solveType(solution, ctx, left.carType, right.carType)
    const name = right.cdrTypeClosure.name
    const carType = right.carType

    const freshName = freshenInCtx(ctx, name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(carType, variable)

    ctx = CtxCons(freshName, carType, ctx)

    solution = solveType(
      solution,
      ctx,
      applyClosure(right.cdrTypeClosure, typedNeutral),
      applyClosure(left.cdrTypeClosure, typedNeutral),
    )

    return solution
  }

  throw new ElaborationError(
    `solveType is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
