import _ from "lodash"
import { applyClosure } from "../closure"
import { Ctx, ctxNames } from "../ctx"
import { equivalent } from "../equivalent"
import * as Errors from "../errors"
import { include } from "../include"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

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
      if (commonNames.has(clazz.name)) {
        const next = nextSubclazz(mod, ctx, clazz.name, subclazz)
        include(mod, ctx, clazz.propertyType, next.propertyType)
        const rest = applyClosure(clazz.restClosure, next.property)
        assertClazz(rest)
        clazz = rest
        subclazz = next.subclazz
      } else {
        const usedNames = [...ctxNames(ctx), ...mod.solution.names]
        const freshName = freshen(usedNames, clazz.name)
        const v = Values.TypedNeutral(
          clazz.propertyType,
          Neutrals.Var(freshName),
        )
        const rest = applyClosure(clazz.restClosure, v)
        assertClazz(rest)
        clazz = rest
      }
    }

    if (clazz.kind === "ClazzFulfilled") {
      if (commonNames.has(clazz.name)) {
        const next = nextSubclazz(mod, ctx, clazz.name, subclazz)
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
      if (subclazz.name === name) {
        const usedNames = [...ctxNames(ctx), ...mod.solution.names]
        const freshName = freshen(usedNames, subclazz.name)
        const v = Values.TypedNeutral(
          subclazz.propertyType,
          Neutrals.Var(freshName),
        )
        const rest = applyClosure(subclazz.restClosure, v)
        assertClazz(rest)
        return {
          propertyType: subclazz.propertyType,
          property: v,
          subclazz: rest,
        }
      } else {
        const usedNames = [...ctxNames(ctx), ...mod.solution.names]
        const freshName = freshen(usedNames, subclazz.name)
        const v = Values.TypedNeutral(
          subclazz.propertyType,
          Neutrals.Var(freshName),
        )
        const rest = applyClosure(subclazz.restClosure, v)
        assertClazz(rest)
        return nextSubclazz(mod, ctx, name, rest)
      }
    }

    case "ClazzFulfilled": {
      if (subclazz.name === name) {
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
