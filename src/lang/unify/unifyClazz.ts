import _ from "lodash"
import type { Ctx } from "../ctx/index.js"
import { ctxNames } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import * as Neutrals from "../neutral/index.js"
import { solutionNames } from "../solution/index.js"
import { unify, unifyType } from "../unify/index.js"
import { freshen } from "../utils/freshen.js"
import * as Values from "../value/index.js"

export function unifyClazz(
  mod: Mod,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): void {
  const leftNames = Values.clazzPropertyNames(left)
  const rightNames = Values.clazzPropertyNames(right)
  const commonNames = new Set(_.intersection(leftNames, rightNames))

  while (left["@kind"] !== "ClazzNull" || right["@kind"] !== "ClazzNull") {
    if (left["@kind"] === "ClazzCons" && !commonNames.has(left.propertyName)) {
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, left.propertyName)
      const v = Values.TypedNeutral(left.propertyType, Neutrals.Var(freshName))
      left = Values.clazzClosureApply(left.restClosure, v)
    }

    if (
      right["@kind"] === "ClazzCons" &&
      !commonNames.has(right.propertyName)
    ) {
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, right.propertyName)
      const v = Values.TypedNeutral(right.propertyType, Neutrals.Var(freshName))
      right = Values.clazzClosureApply(right.restClosure, v)
    }

    if (
      left["@kind"] === "ClazzFulfilled" &&
      !commonNames.has(left.propertyName)
    ) {
      left = left.rest
    }

    if (
      right["@kind"] === "ClazzFulfilled" &&
      !commonNames.has(right.propertyName)
    ) {
      right = right.rest
    }

    if (
      left["@kind"] === "ClazzCons" &&
      commonNames.has(left.propertyName) &&
      right["@kind"] === "ClazzFulfilled" &&
      commonNames.has(right.propertyName)
    ) {
      if (left.propertyName !== right.propertyName) {
        throw new Errors.UnificationError(
          [
            `[unifyClazz] property out of order`,
            `  left: ${left.propertyName}`,
            `  right: ${right.propertyName}`,
          ].join("\n"),
        )
      }

      unifyType(mod, ctx, left.propertyType, right.propertyType)
      left = Values.clazzClosureApply(left.restClosure, right.property)
      right = right.rest
    }

    if (
      left["@kind"] === "ClazzFulfilled" &&
      commonNames.has(left.propertyName) &&
      right["@kind"] === "ClazzCons" &&
      commonNames.has(right.propertyName)
    ) {
      if (left.propertyName !== right.propertyName) {
        throw new Errors.UnificationError(
          [
            `[unifyClazz] property out of order`,
            `  left: ${left.propertyName}`,
            `  right: ${right.propertyName}`,
          ].join("\n"),
        )
      }

      unifyType(mod, ctx, left.propertyType, right.propertyType)
      right = Values.clazzClosureApply(right.restClosure, left.property)
      left = left.rest
    }

    if (
      left["@kind"] === "ClazzCons" &&
      commonNames.has(left.propertyName) &&
      right["@kind"] === "ClazzCons" &&
      commonNames.has(right.propertyName)
    ) {
      if (left.propertyName !== right.propertyName) {
        throw new Errors.UnificationError(
          [
            `[unifyClazz] property out of order`,
            `  left: ${left.propertyName}`,
            `  right: ${right.propertyName}`,
          ].join("\n"),
        )
      }

      unifyType(mod, ctx, left.propertyType, right.propertyType)
      const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
      const freshName = freshen(usedNames, right.propertyName)
      const v = Values.TypedNeutral(right.propertyType, Neutrals.Var(freshName))
      left = Values.clazzClosureApply(left.restClosure, v)
      right = Values.clazzClosureApply(right.restClosure, v)
    }

    if (
      left["@kind"] === "ClazzFulfilled" &&
      commonNames.has(left.propertyName) &&
      right["@kind"] === "ClazzFulfilled" &&
      commonNames.has(right.propertyName)
    ) {
      if (left.propertyName !== right.propertyName) {
        throw new Errors.UnificationError(
          [
            `[unifyClazz] property out of order`,
            `  left: ${left.propertyName}`,
            `  right: ${right.propertyName}`,
          ].join("\n"),
        )
      }

      unifyType(mod, ctx, left.propertyType, right.propertyType)
      unify(mod, ctx, right.propertyType, left.property, right.property)
      left = left.rest
      right = right.rest
    }
  }
}
