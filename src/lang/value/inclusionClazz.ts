import _ from "lodash"
import { applyClosure } from "../closure"
import { Ctx, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { unify } from "../solution"
import { freshen, freshenNames } from "../utils/freshen"
import * as Values from "../value"
import { assertClazz, clazzExpel, inclusion, Value } from "../value"

/**

   To compare `Clazz`es out of order,
   all we need is to prepare the `freshNames` first,
   because for example, in the case of `Sigma` in `equivalentType`,
   all we need is to make sure that the `freshName` are the same
   when building the `TypedNeutral`.

   Then `clazzExpel` use the `freshName`
   to expel all types and values from `Values.Clazz`,
   it returns a `PropertyMap`, so that the order does not matters anymore.

**/

export function inclusionClazz(
  mod: Mod,
  ctx: Ctx,
  subclazz: Values.Clazz,
  clazz: Values.Clazz,
): void {
  const freshNameMap = freshenNames(
    [...ctxNames(ctx), ...mod.solution.names],
    [
      ...Values.clazzPropertyNames(subclazz),
      ...Values.clazzPropertyNames(clazz),
    ],
  )

  const subclazzPropertyMap = clazzExpel(freshNameMap, subclazz)
  const clazzPropertyMap = clazzExpel(freshNameMap, clazz)

  for (const [name, clazzProperty] of clazzPropertyMap.entries()) {
    const subclazzProperty = subclazzPropertyMap.get(name)
    if (subclazzProperty === undefined) {
      throw new Errors.InclusionError(
        `inclusionClazz expect subclass to have property: ${name}`,
      )
    }

    const freshName = freshNameMap.get(name)
    if (freshName === undefined) {
      throw new Errors.InternalError(
        `unifyClazz expect ${name} to be found in freshNameMap`,
      )
    }

    try {
      inclusionClazzProperty(
        mod,
        ctx,
        name,
        freshName,
        subclazzProperty,
        clazzProperty,
      )
    } catch (error) {
      if (error instanceof Errors.InclusionError) {
        error.trace.unshift([`[inclusion property] ${name}`].join("\n"))
      }

      throw error
    }
  }
}

function inclusionClazzProperty(
  mod: Mod,
  ctx: Ctx,
  name: string,
  freshName: string,
  subclazzProperty: { type: Value; value?: Value },
  clazzProperty: { type: Value; value?: Value },
): void {
  if (
    subclazzProperty.value === undefined &&
    clazzProperty.value !== undefined
  ) {
    throw new Errors.InclusionError(
      [
        `inclusionClazz expect subclass to have fulfilled property value`,
        `  property name: ${name}`,
      ].join("\n"),
    )
  }

  inclusion(mod, ctx, subclazzProperty.type, clazzProperty.type)

  if (
    subclazzProperty.value !== undefined &&
    clazzProperty.value !== undefined
  ) {
    unify(
      mod,
      ctx,
      clazzProperty.type,
      subclazzProperty.value,
      clazzProperty.value,
    )
  }

  if (
    subclazzProperty.value !== undefined &&
    clazzProperty.value === undefined
  ) {
    unify(
      mod,
      ctx,
      clazzProperty.type,
      subclazzProperty.value,
      mod.solution.createPatternVar(freshName, subclazzProperty.type),
    )
  }
}

export function inclusionClazzOrdered(
  mod: Mod,
  ctx: Ctx,
  subclazz: Values.Clazz,
  clazz: Values.Clazz,
): void {
  const subclazzNames = Values.clazzPropertyNames(subclazz)
  const clazzNames = Values.clazzPropertyNames(clazz)
  const missingNames = _.difference(clazzNames, subclazzNames)
  if (missingNames.length > 0) {
    throw new Errors.InclusionError(
      [
        `inclusionClazz found property names of class not included in the subclass`,
        `  missing names: ${missingNames.join(", ")}`,
      ].join("\n"),
    )
  }

  const commonNames = new Set(_.intersection(subclazzNames, clazzNames))
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (commonNames.has(clazz.name)) {
        const next = nextSubclazz(mod, ctx, clazz.name, subclazz)
        inclusion(mod, ctx, next.propertyType, clazz.propertyType)
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
        inclusion(mod, ctx, next.propertyType, clazz.propertyType)
        unify(mod, ctx, next.propertyType, next.property, clazz.property)
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
        `inclusionClazz fail to find next subclass of name: ${name}`,
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
