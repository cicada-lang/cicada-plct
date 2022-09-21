import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import { EquationError } from "../errors"
import * as Neutrals from "../neutral"
import {
  Solution,
  solve,
  solveClazz,
  solveNeutral,
  solveVar,
} from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { isClazz, Value } from "../value"

export function solveType(
  solution: Solution,
  ctx: Ctx,
  left: Value,
  right: Value,
): void {
  left = solution.walk(left)
  right = solution.walk(right)

  const success = solveVar(solution, left, right)
  if (success) return

  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    solveNeutral(solution, ctx, left.neutral, right.neutral)
    return
  }

  if (left.kind === "Type" && right.kind === "Type") {
    return
  }

  if (left.kind === "String" && right.kind === "String") {
    return
  }

  if (left.kind === "Trivial" && right.kind === "Trivial") {
    return
  }

  if (left.kind === "Pi" && right.kind === "Pi") {
    solveType(solution, ctx, left.argType, right.argType)
    const name = right.retTypeClosure.name
    const argType = right.argType

    const usedNames = [...ctxNames(ctx), ...solution.names]
    const freshName = freshen(usedNames, name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(argType, variable)

    ctx = CtxCons(freshName, argType, ctx)

    solve(
      solution,
      ctx,
      Values.Type(),
      applyClosure(right.retTypeClosure, typedNeutral),
      applyClosure(left.retTypeClosure, typedNeutral),
    )

    return
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    solveType(solution, ctx, left.carType, right.carType)
    const name = right.cdrTypeClosure.name
    const carType = right.carType

    const usedNames = [...ctxNames(ctx), ...solution.names]
    const freshName = freshen(usedNames, name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(carType, variable)

    ctx = CtxCons(freshName, carType, ctx)

    solve(
      solution,
      ctx,
      Values.Type(),
      applyClosure(right.cdrTypeClosure, typedNeutral),
      applyClosure(left.cdrTypeClosure, typedNeutral),
    )

    return
  }

  if (isClazz(left) && isClazz(right)) {
    solveClazz(solution, ctx, left, right)
    return
  }

  throw new EquationError(
    `solveType is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
