import _ from "lodash"
import type { Ctx } from "../ctx"
import { ctxNames } from "../ctx"
import { equivalent } from "../equivalent"
import * as Errors from "../errors"
import { include } from "../include"
import type { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"

export function includeClazz(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  subclazz: Values.Clazz,
): void {
  const subclazzNames = Values.clazzPropertyNames(subclazz)
  const clazzNames = Values.clazzPropertyNames(clazz)
  const missingNames = _.difference(clazzNames, subclazzNames)
  if (missingNames.length > 0) {
    throw new Errors.InclusionError(
      [
        `[includeClazz] found property names of class not included in the subclass`,
        `  missing names: ${missingNames.join(", ")}`,
      ].join("\n"),
    )
  }

  const commonNames = new Set(_.intersection(subclazzNames, clazzNames))

  while (clazz.kind !== "ClazzNull" || subclazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons" && !commonNames.has(clazz.propertyName)) {
      const usedNames = ctxNames(ctx)
      const freshName = freshen(usedNames, clazz.propertyName)
      const v = Values.TypedNeutral(clazz.propertyType, Neutrals.Var(freshName))
      clazz = Values.clazzClosureApply(clazz.restClosure, v)
    }

    if (
      subclazz.kind === "ClazzCons" &&
      !commonNames.has(subclazz.propertyName)
    ) {
      const usedNames = ctxNames(ctx)
      const freshName = freshen(usedNames, subclazz.propertyName)
      const v = Values.TypedNeutral(
        subclazz.propertyType,
        Neutrals.Var(freshName),
      )
      subclazz = Values.clazzClosureApply(subclazz.restClosure, v)
    }

    if (
      clazz.kind === "ClazzFulfilled" &&
      !commonNames.has(clazz.propertyName)
    ) {
      clazz = clazz.rest
    }

    if (
      subclazz.kind === "ClazzFulfilled" &&
      !commonNames.has(subclazz.propertyName)
    ) {
      subclazz = subclazz.rest
    }

    if (
      clazz.kind === "ClazzCons" &&
      commonNames.has(clazz.propertyName) &&
      subclazz.kind === "ClazzFulfilled" &&
      commonNames.has(subclazz.propertyName)
    ) {
      if (clazz.propertyName !== subclazz.propertyName) {
        throw new Errors.UnificationError(
          [
            `[includeClazz] property out of order`,
            `  class: ${clazz.propertyName}`,
            `  subclass: ${subclazz.propertyName}`,
          ].join("\n"),
        )
      }

      include(mod, ctx, clazz.propertyType, subclazz.propertyType)
      clazz = Values.clazzClosureApply(clazz.restClosure, subclazz.property)
      subclazz = subclazz.rest
    }

    if (
      clazz.kind === "ClazzFulfilled" &&
      commonNames.has(clazz.propertyName) &&
      subclazz.kind === "ClazzCons" &&
      commonNames.has(subclazz.propertyName)
    ) {
      if (clazz.propertyName !== subclazz.propertyName) {
        throw new Errors.UnificationError(
          [
            `[includeClazz] property out of order`,
            `  class: ${clazz.propertyName}`,
            `  subclass: ${subclazz.propertyName}`,
          ].join("\n"),
        )
      }

      throw new Errors.UnificationError(
        [
          `[includeClazz] class is fulfilled, but subclass is not`,
          `  property: ${clazz.propertyName}`,
        ].join("\n"),
      )
    }

    if (
      clazz.kind === "ClazzCons" &&
      commonNames.has(clazz.propertyName) &&
      subclazz.kind === "ClazzCons" &&
      commonNames.has(subclazz.propertyName)
    ) {
      if (clazz.propertyName !== subclazz.propertyName) {
        throw new Errors.UnificationError(
          [
            `[includeClazz] property out of order`,
            `  class: ${clazz.propertyName}`,
            `  subclass: ${subclazz.propertyName}`,
          ].join("\n"),
        )
      }

      include(mod, ctx, clazz.propertyType, subclazz.propertyType)
      const usedNames = ctxNames(ctx)
      const freshName = freshen(usedNames, subclazz.propertyName)
      const v = Values.TypedNeutral(
        subclazz.propertyType,
        Neutrals.Var(freshName),
      )
      clazz = Values.clazzClosureApply(clazz.restClosure, v)
      subclazz = Values.clazzClosureApply(subclazz.restClosure, v)
    }

    if (
      clazz.kind === "ClazzFulfilled" &&
      commonNames.has(clazz.propertyName) &&
      subclazz.kind === "ClazzFulfilled" &&
      commonNames.has(subclazz.propertyName)
    ) {
      if (clazz.propertyName !== subclazz.propertyName) {
        throw new Errors.UnificationError(
          [
            `[includeClazz] property out of order`,
            `  class: ${clazz.propertyName}`,
            `  subclass: ${subclazz.propertyName}`,
          ].join("\n"),
        )
      }

      include(mod, ctx, clazz.propertyType, subclazz.propertyType)
      equivalent(
        mod,
        ctx,
        subclazz.propertyType,
        clazz.property,
        subclazz.property,
      )
      clazz = clazz.rest
      subclazz = subclazz.rest
    }
  }
}
