import _ from "lodash"
import { Ctx, ctxNames } from "../ctx"
import { equivalent } from "../equivalent"
import * as Errors from "../errors"
import { include } from "../include"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import type { Value } from "../value"
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
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (commonNames.has(clazz.propertyName)) {
        const next = nextSubclazz(mod, ctx, clazz.propertyName, subclazz)
        include(mod, ctx, clazz.propertyType, next.propertyType)
        clazz = Values.clazzClosureApply(clazz.restClosure, next.property)
        subclazz = next.subclazz
      } else {
        const usedNames = ctxNames(ctx)
        const freshName = freshen(usedNames, clazz.propertyName)
        const v = Values.TypedNeutral(
          clazz.propertyType,
          Neutrals.Var(freshName),
        )
        clazz = Values.clazzClosureApply(clazz.restClosure, v)
      }
    }

    if (clazz.kind === "ClazzFulfilled") {
      if (commonNames.has(clazz.propertyName)) {
        const next = nextSubclazz(mod, ctx, clazz.propertyName, subclazz)
        include(mod, ctx, clazz.propertyType, next.propertyType)
        equivalent(mod, ctx, next.propertyType, clazz.property, next.property)
        clazz = clazz.rest
        subclazz = next.subclazz
      } else {
        clazz = clazz.rest
      }
    }
  }
}

function nextSubclazz(
  mod: Mod,
  ctx: Ctx,
  name: string,
  subclazz: Values.Clazz,
): {
  propertyType: Value
  property: Value
  subclazz: Values.Clazz
} {
  switch (subclazz.kind) {
    case "ClazzNull": {
      throw new Errors.InclusionError(
        `[includeClazz nextSubclazz] fail to find next subclass of name: ${name}`,
      )
    }

    case "ClazzCons": {
      if (subclazz.propertyName === name) {
        const usedNames = ctxNames(ctx)
        const freshName = freshen(usedNames, subclazz.propertyName)
        const v = Values.TypedNeutral(
          subclazz.propertyType,
          Neutrals.Var(freshName),
        )
        return {
          propertyType: subclazz.propertyType,
          property: v,
          subclazz: Values.clazzClosureApply(subclazz.restClosure, v),
        }
      } else {
        const usedNames = ctxNames(ctx)
        const freshName = freshen(usedNames, subclazz.propertyName)
        const v = Values.TypedNeutral(
          subclazz.propertyType,
          Neutrals.Var(freshName),
        )
        return nextSubclazz(
          mod,
          ctx,
          name,
          Values.clazzClosureApply(subclazz.restClosure, v),
        )
      }
    }

    case "ClazzFulfilled": {
      if (subclazz.propertyName === name) {
        return {
          propertyType: subclazz.propertyType,
          property: subclazz.property,
          subclazz: subclazz.rest,
        }
      } else {
        return nextSubclazz(mod, ctx, name, subclazz.rest)
      }
    }
  }
}
