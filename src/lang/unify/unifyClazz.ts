import _ from "lodash"
import { applyClosure } from "../closure"
import { Ctx, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { Solution, solutionNames } from "../solution"
import { unify, unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

export function unifyClazz(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
  left: Values.Clazz,
  right: Values.Clazz,
): Solution {
  const leftNames = Values.clazzPropertyNames(left)
  const rightNames = Values.clazzPropertyNames(right)

  const commonNames = new Set(_.intersection(leftNames, rightNames))
  while (left.kind !== "ClazzNull") {
    if (left.kind === "ClazzCons") {
      if (commonNames.has(left.name)) {
        const next = nextRight(mod, ctx, solution, left.name, right)
        solution = unifyType(
          mod,
          ctx,
          solution,
          left.propertyType,
          next.propertyType,
        )
        const rest = applyClosure(left.restClosure, next.property)
        assertClazz(rest)
        left = rest
        right = next.right
      } else {
        const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
        const freshName = freshen(usedNames, left.name)
        const v = Values.TypedNeutral(
          left.propertyType,
          Neutrals.Var(freshName),
        )
        const rest = applyClosure(left.restClosure, v)
        assertClazz(rest)
        left = rest
      }
    }

    if (left.kind === "ClazzFulfilled") {
      if (commonNames.has(left.name)) {
        const next = nextRight(
          mod,
          ctx,
          solution,
          left.name,
          right,
          left.property,
        )
        solution = unifyType(
          mod,
          ctx,
          solution,
          left.propertyType,
          next.propertyType,
        )

        // NOTE Should avoid unify `left.property` to `next.property`,
        //   when we know `next.property` is `left.property`.
        if (left.property !== next.property) {
          // TODO If `next.property` is a neutral variable,
          //   should we unify them at all?
          solution = unify(
            mod,
            ctx,
            solution,
            next.propertyType,
            left.property,
            next.property,
          )
        }

        left = left.rest
        right = next.right
      } else {
        left = left.rest
      }
    }
  }

  return solution
}

function nextRight(
  mod: Mod,
  ctx: Ctx,
  solution: Solution,
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
      if (right.name === name) {
        if (leftProperty !== undefined) {
          const rest = applyClosure(right.restClosure, leftProperty)
          assertClazz(rest)
          return {
            propertyType: right.propertyType,
            property: leftProperty,
            right: rest,
          }
        } else {
          const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
          const freshName = freshen(usedNames, right.name)
          const v = Values.TypedNeutral(
            right.propertyType,
            Neutrals.Var(freshName),
          )
          const rest = applyClosure(right.restClosure, v)
          assertClazz(rest)
          return {
            propertyType: right.propertyType,
            property: v,
            right: rest,
          }
        }
      } else {
        const usedNames = [...ctxNames(ctx), ...solutionNames(solution)]
        const freshName = freshen(usedNames, right.name)
        const v = Values.TypedNeutral(
          right.propertyType,
          Neutrals.Var(freshName),
        )
        const rest = applyClosure(right.restClosure, v)
        assertClazz(rest)
        return nextRight(mod, ctx, solution, name, rest, leftProperty)
      }
    }

    case "ClazzFulfilled": {
      if (right.name === name) {
        return {
          propertyType: right.propertyType,
          property: right.property,
          right: right.rest,
        }
      } else {
        return nextRight(mod, ctx, solution, name, right.rest, leftProperty)
      }
    }
  }
}
