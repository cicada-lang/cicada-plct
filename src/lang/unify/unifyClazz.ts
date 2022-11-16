import _ from "lodash"
import type { Ctx } from "../ctx"
import { ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { solutionNames } from "../solution"
import { unify, unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import type { Value } from "../value"
import * as Values from "../value"

export function unifyClazz(
  mod: Mod,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): void {
  const leftNames = Values.clazzPropertyNames(left)
  const rightNames = Values.clazzPropertyNames(right)

  const commonNames = new Set(_.intersection(leftNames, rightNames))
  while (left.kind !== "ClazzNull") {
    if (left.kind === "ClazzCons") {
      if (commonNames.has(left.propertyName)) {
        const next = nextRight(mod, ctx, left.propertyName, right)
        unifyType(mod, ctx, left.propertyType, next.propertyType)
        left = Values.clazzClosureApply(left.restClosure, next.property)
        right = next.right
      } else {
        const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
        const freshName = freshen(usedNames, left.propertyName)
        const v = Values.TypedNeutral(
          left.propertyType,
          Neutrals.Var(freshName),
        )
        left = Values.clazzClosureApply(left.restClosure, v)
      }
    }

    if (left.kind === "ClazzFulfilled") {
      if (commonNames.has(left.propertyName)) {
        const next = nextRight(
          mod,
          ctx,
          left.propertyName,
          right,
          left.property,
        )
        unifyType(mod, ctx, left.propertyType, next.propertyType)

        // NOTE Should avoid unify `left.property` to `next.property`,
        //   when we know `next.property` is `left.property`.
        if (left.property !== next.property) {
          // TODO If `next.property` is a neutral variable,
          //   should we unify them at all?
          unify(mod, ctx, next.propertyType, left.property, next.property)
        }

        left = left.rest
        right = next.right
      } else {
        left = left.rest
      }
    }
  }
}

function nextRight(
  mod: Mod,
  ctx: Ctx,
  name: string,
  right: Values.Clazz,
  leftProperty?: Value,
): {
  propertyType: Value
  property: Value
  right: Values.Clazz
} {
  switch (right.kind) {
    case "ClazzNull": {
      throw new Errors.InclusionError(
        `[unifyClazz nextRight] fail to find next subclass of name: ${name}`,
      )
    }

    case "ClazzCons": {
      if (right.propertyName === name) {
        if (leftProperty !== undefined) {
          return {
            propertyType: right.propertyType,
            property: leftProperty,
            right: Values.clazzClosureApply(right.restClosure, leftProperty),
          }
        } else {
          const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
          const freshName = freshen(usedNames, right.propertyName)
          const v = Values.TypedNeutral(
            right.propertyType,
            Neutrals.Var(freshName),
          )
          return {
            propertyType: right.propertyType,
            property: v,
            right: Values.clazzClosureApply(right.restClosure, v),
          }
        }
      } else {
        const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
        const freshName = freshen(usedNames, right.propertyName)
        const v = Values.TypedNeutral(
          right.propertyType,
          Neutrals.Var(freshName),
        )
        return nextRight(
          mod,
          ctx,
          name,
          Values.clazzClosureApply(right.restClosure, v),
          leftProperty,
        )
      }
    }

    case "ClazzFulfilled": {
      if (right.propertyName === name) {
        return {
          propertyType: right.propertyType,
          property: right.property,
          right: right.rest,
        }
      } else {
        return nextRight(mod, ctx, name, right.rest, leftProperty)
      }
    }
  }
}
