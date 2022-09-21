import { Ctx } from "../ctx"
import { EquationError } from "../errors"
import { Neutral } from "../neutral"
import { Solution, solveTypedValue } from "../solution"

export function solveNeutral(
  solution: Solution,
  ctx: Ctx,
  left: Neutral,
  right: Neutral,
): void {
  if (left.kind === "Var" && right.kind === "Var") {
    if (left.name !== right.name) {
      throw new EquationError(
        `solveNeutral expect left name: ${left.name}, to be equal to right name: ${right.name}`,
      )
    }

    return
  }

  if (left.kind === "Ap" && right.kind === "Ap") {
    solveNeutral(solution, ctx, left.target, right.target)
    solveTypedValue(solution, ctx, left.arg, right.arg)
    return
  }

  if (left.kind === "ApImplicit" && right.kind === "ApImplicit") {
    solveNeutral(solution, ctx, left.target, right.target)
    solveTypedValue(solution, ctx, left.arg, right.arg)
    return
  }

  if (left.kind === "Car" && right.kind === "Car") {
    solveNeutral(solution, ctx, left.target, right.target)
    return
  }

  if (left.kind === "Cdr" && right.kind === "Cdr") {
    solveNeutral(solution, ctx, left.target, right.target)
    return
  }

  if (left.kind === "Dot" && right.kind === "Dot") {
    if (left.name !== right.name) {
      throw new EquationError(
        `solveNeutral expect left property name: ${left.name}, to be equal to right property name: ${right.name}`,
      )
    }

    solveNeutral(solution, ctx, left.target, right.target)
    return
  }

  throw new EquationError(
    `solveNeutral is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
