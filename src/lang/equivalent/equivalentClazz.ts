import { indent } from "../../utils/indent"
import type { Ctx } from "../ctx"
import { ctxNames } from "../ctx"
import { equivalent, equivalentType } from "../equivalent"
import * as Errors from "../errors"
import type { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { solutionNames } from "../solution"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { formatType } from "../value"

export function equivalentClazz(
  mod: Mod,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): void {
  while (left["@kind"] !== "ClazzNull" && right["@kind"] !== "ClazzNull") {
    if (
      left["@kind"] === "ClazzCons" &&
      right["@kind"] === "ClazzCons" &&
      left.propertyName === right.propertyName
    ) {
      equivalentType(mod, ctx, left.propertyType, right.propertyType)
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, right.propertyName)
      const v = Values.TypedNeutral(right.propertyType, Neutrals.Var(freshName))
      left = Values.clazzClosureApply(left.restClosure, v)
      right = Values.clazzClosureApply(right.restClosure, v)
    } else if (
      left["@kind"] === "ClazzFulfilled" &&
      right["@kind"] === "ClazzFulfilled" &&
      left.propertyName === right.propertyName
    ) {
      equivalentType(mod, ctx, left.propertyType, right.propertyType)
      equivalent(mod, ctx, right.propertyType, left.property, right.property)
      left = left.rest
      right = right.rest
    } else {
      throw new Errors.EquivalenceError(
        [
          `[equivalentClazz] fail`,

          indent(`left: ${formatType(mod, ctx, left)}`),
          indent(`right: ${formatType(mod, ctx, right)}`),
        ].join("\n"),
      )
    }
  }
}
