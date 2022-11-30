import { indent } from "../../utils/indent"
import type { Ctx } from "../ctx"
import { equivalent, equivalentType } from "../equivalent"
import * as Errors from "../errors"
import type { Mod } from "../mod"
import type { Neutral } from "../neutral"
import type { Value } from "../value"
import { formatNeutral, TypedValue } from "../value"

function equivalentTypedValue(
  mod: Mod,
  ctx: Ctx,
  left: TypedValue,
  right: TypedValue,
): void {
  equivalentType(mod, ctx, left.type, right.type)
  equivalent(mod, ctx, left.type, left.value, right.value)
}

export function equivalentNeutral(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Neutral,
  right: Neutral,
): void {
  if (left["@kind"] === "Var" && right["@kind"] === "Var") {
    if (left.name !== right.name) {
      throw new Errors.EquivalenceError(
        [
          `[equivalentNeutral] expect variable names to be equal`,
          `  left: ${left.name}`,
          `  right: ${right.name}`,
        ].join("\n"),
      )
    }

    return
  }

  if (left["@kind"] === "PatternVar" && right["@kind"] === "PatternVar") {
    if (left.name !== right.name) {
      throw new Errors.EquivalenceError(
        [
          `[equivalentNeutral] expect pattern variable names to be equal`,
          `  left: ${left.name}`,
          `  right: ${right.name}`,
        ].join("\n"),
      )
    }

    return
  }

  if (left["@kind"] === "Ap" && right["@kind"] === "Ap") {
    // equivalentType(mod, ctx, left.targetType, right.targetType)
    equivalentNeutral(mod, ctx, left.targetType, left.target, right.target)
    equivalentTypedValue(mod, ctx, left.arg, right.arg)
    return
  }

  if (left["@kind"] === "ApImplicit" && right["@kind"] === "ApImplicit") {
    // equivalentType(mod, ctx, left.targetType, right.targetType)
    equivalentNeutral(mod, ctx, left.targetType, left.target, right.target)
    equivalentTypedValue(mod, ctx, left.arg, right.arg)
    return
  }

  if (left["@kind"] === "Car" && right["@kind"] === "Car") {
    // equivalentType(mod, ctx, left.targetType, right.targetType)
    equivalentNeutral(mod, ctx, left.targetType, left.target, right.target)
    return
  }

  if (left["@kind"] === "Cdr" && right["@kind"] === "Cdr") {
    // equivalentType(mod, ctx, left.targetType, right.targetType)
    equivalentNeutral(mod, ctx, left.targetType, left.target, right.target)
    return
  }

  if (left["@kind"] === "Dot" && right["@kind"] === "Dot") {
    if (left.name !== right.name) {
      throw new Errors.EquivalenceError(
        [
          `[equivalentNeutral] expect dot neutrals to have the same property name`,
          `  left: ${left.name}`,
          `  right: ${right.name}`,
        ].join("\n"),
      )
    }

    // equivalentType(mod, ctx, left.targetType, right.targetType)
    equivalentNeutral(mod, ctx, left.targetType, left.target, right.target)
    return
  }

  if (left["@kind"] === "Replace" && right["@kind"] === "Replace") {
    // equivalentType(mod, ctx, left.targetType, right.targetType)
    equivalentNeutral(mod, ctx, left.targetType, left.target, right.target)
    equivalentTypedValue(mod, ctx, left.motive, right.motive)
    equivalentTypedValue(mod, ctx, left.base, right.base)
    return
  }

  throw new Errors.EquivalenceError(
    [
      `[equivalentNeutral] is not implemented for the pair of neutrals`,
      indent(`left: ${formatNeutral(mod, ctx, left)}`),
      indent(`right: ${formatNeutral(mod, ctx, right)}`),
    ].join("\n"),
  )
}
