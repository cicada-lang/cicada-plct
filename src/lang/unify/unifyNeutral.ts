import { indent } from "../../utils/indent"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { Solution } from "../solution"
import { unify, unifyType } from "../unify"
import { formatNeutral, TypedValue } from "../value"

function unifyTypedValue(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  left: TypedValue,
  right: TypedValue,
): Solution {
  solution = unifyType(mod, ctx, solution, left.type, right.type)
  solution = unify(mod, ctx, solution, left.type, left.value, right.value)
  return solution
}

export function unifyNeutral(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  left: Neutral,
  right: Neutral,
): Solution {
  if (left.kind === "Var" && right.kind === "Var") {
    if (left.name !== right.name) {
      throw new Errors.UnificationError(
        [
          `[unifyNeutral] expect variable names to be equal`,
          `  left: ${left.name}`,
          `  right: ${right.name}`,
        ].join("\n"),
      )
    }

    return solution
  }

  if (left.kind === "Ap" && right.kind === "Ap") {
    solution = unifyNeutral(mod, ctx, solution, left.target, right.target)
    solution = unifyTypedValue(mod, ctx, solution, left.arg, right.arg)
    return solution
  }

  if (left.kind === "ApImplicit" && right.kind === "ApImplicit") {
    solution = unifyNeutral(mod, ctx, solution, left.target, right.target)
    solution = unifyTypedValue(mod, ctx, solution, left.arg, right.arg)
    return solution
  }

  if (left.kind === "Car" && right.kind === "Car") {
    solution = unifyNeutral(mod, ctx, solution, left.target, right.target)
    return solution
  }

  if (left.kind === "Cdr" && right.kind === "Cdr") {
    solution = unifyNeutral(mod, ctx, solution, left.target, right.target)
    return solution
  }

  if (left.kind === "Dot" && right.kind === "Dot") {
    if (left.name !== right.name) {
      throw new Errors.UnificationError(
        [
          `[unifyNeutral] expect dot neutrals to have the same property name`,
          `  left: ${left.name}`,
          `  right: ${right.name}`,
        ].join("\n"),
      )
    }

    solution = unifyNeutral(mod, ctx, solution, left.target, right.target)
    return solution
  }

  if (left.kind === "Replace" && right.kind === "Replace") {
    solution = unifyNeutral(mod, ctx, solution, left.target, right.target)
    solution = unifyTypedValue(mod, ctx, solution, left.motive, right.motive)
    solution = unifyTypedValue(mod, ctx, solution, left.base, right.base)
    return solution
  }

  throw new Errors.UnificationError(
    [
      `[unifyNeutral] is not implemented for the pair of neutrals`,
      indent(`left: ${formatNeutral(mod, ctx, solution, left)}`),
      indent(`right: ${formatNeutral(mod, ctx, solution, right)}`),
    ].join("\n"),
  )
}
