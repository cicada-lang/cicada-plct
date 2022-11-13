import { indent } from "../../utils/indent"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { unify, unifyType } from "../unify"
import { formatNeutral, TypedValue } from "../value"

function unifyTypedValue(
  mod: Mod,
  ctx: Ctx,
  left: TypedValue,
  right: TypedValue,
): void {
  unifyType(mod, ctx, left.type, right.type)
  unify(mod, ctx, left.type, left.value, right.value)
}

export function unifyNeutral(
  mod: Mod,
  ctx: Ctx,
  left: Neutral,
  right: Neutral,
): void {
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

    return
  }

  if (left.kind === "Ap" && right.kind === "Ap") {
    unifyNeutral(mod, ctx, left.target, right.target)
    unifyTypedValue(mod, ctx, left.arg, right.arg)
    return
  }

  if (left.kind === "ApImplicit" && right.kind === "ApImplicit") {
    unifyNeutral(mod, ctx, left.target, right.target)
    unifyTypedValue(mod, ctx, left.arg, right.arg)
    return
  }

  if (left.kind === "Car" && right.kind === "Car") {
    unifyNeutral(mod, ctx, left.target, right.target)
    return
  }

  if (left.kind === "Cdr" && right.kind === "Cdr") {
    unifyNeutral(mod, ctx, left.target, right.target)
    return
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

    unifyNeutral(mod, ctx, left.target, right.target)
    return
  }

  if (left.kind === "Replace" && right.kind === "Replace") {
    unifyNeutral(mod, ctx, left.target, right.target)
    unifyTypedValue(mod, ctx, left.motive, right.motive)
    unifyTypedValue(mod, ctx, left.base, right.base)
    return
  }

  throw new Errors.UnificationError(
    [
      `[unifyNeutral] is not implemented for the pair of neutrals`,
      indent(`left: ${formatNeutral(mod, ctx, left)}`),
      indent(`right: ${formatNeutral(mod, ctx, right)}`),
    ].join("\n"),
  )
}
