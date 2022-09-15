import { Ctx } from "../ctx"
import { EquationError } from "../errors"
import { Neutral } from "../neutral"
import { Solution, solveTypedValue } from "../solution"

export function solveNeutral(
  solution: Solution,
  ctx: Ctx,
  left: Neutral,
  right: Neutral,
): Solution {
  if (left.kind === "Var" && right.kind === "Var") {
    if (left.name !== right.name) {
      throw new EquationError(
        `solveNeutral expect left name: ${left.name}, to be equal to right name: ${right.name}`,
      )
    }

    return solution
  }

  if (left.kind === "Ap" && right.kind === "Ap") {
    solution = solveNeutral(solution, ctx, left.target, right.target)
    solution = solveTypedValue(solution, ctx, left.arg, right.arg)
    return solution
  }

  if (left.kind === "Car" && right.kind === "Car") {
    solution = solveNeutral(solution, ctx, left.target, right.target)
    return solution
  }

  if (left.kind === "Cdr" && right.kind === "Cdr") {
    solution = solveNeutral(solution, ctx, left.target, right.target)
    return solution
  }

  if (left.kind === "Dot" && right.kind === "Dot") {
    if (left.name !== right.name) {
      throw new EquationError(
        `solveNeutral expect left property name: ${left.name}, to be equal to right property name: ${right.name}`,
      )
    }

    solution = solveNeutral(solution, ctx, left.target, right.target)
    return solution
  }

  throw new EquationError(
    `solveNeutral is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
