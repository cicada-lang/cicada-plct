import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Neutral } from "../neutral"
import { Solution, unifyTypedValue } from "../solution"

export function unifyNeutral(solution: Solution, ctx: Ctx, left: Neutral, right: Neutral): void {
  if (left.kind === "Var" && right.kind === "Var") {
    if (left.name !== right.name) {
      throw new Errors.EquationError(
        `unifyNeutral expect left name: ${left.name}, to be equal to right name: ${right.name}`,
      )
    }

    return
  }

  if (left.kind === "Ap" && right.kind === "Ap") {
    unifyNeutral(solution, ctx, left.target, right.target)
    unifyTypedValue(solution, ctx, left.arg, right.arg)
    return
  }

  if (left.kind === "ApImplicit" && right.kind === "ApImplicit") {
    unifyNeutral(solution, ctx, left.target, right.target)
    unifyTypedValue(solution, ctx, left.arg, right.arg)
    return
  }

  if (left.kind === "Car" && right.kind === "Car") {
    unifyNeutral(solution, ctx, left.target, right.target)
    return
  }

  if (left.kind === "Cdr" && right.kind === "Cdr") {
    unifyNeutral(solution, ctx, left.target, right.target)
    return
  }

  if (left.kind === "Dot" && right.kind === "Dot") {
    if (left.name !== right.name) {
      throw new Errors.EquationError(
        `unifyNeutral expect left property name: ${left.name}, to be equal to right property name: ${right.name}`,
      )
    }

    unifyNeutral(solution, ctx, left.target, right.target)
    return
  }

  throw new Errors.EquationError(
    `unifyNeutral is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
