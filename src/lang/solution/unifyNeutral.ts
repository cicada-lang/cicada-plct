import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { Neutral } from "../neutral"
import { unifyTypedValue } from "../solution"

export function unifyNeutral(
  mod: Mod,
  ctx: Ctx,
  left: Neutral,
  right: Neutral,
): void {
  if (left.kind === "Var" && right.kind === "Var") {
    if (left.name !== right.name) {
      throw new Errors.UnificationError(
        `unifyNeutral expect left name: ${left.name}, to be equal to right name: ${right.name}`,
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
        `unifyNeutral expect left property name: ${left.name}, to be equal to right property name: ${right.name}`,
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
    `unifyNeutral is not implemented for left: ${left.kind}, right: ${right.kind}`,
  )
}
