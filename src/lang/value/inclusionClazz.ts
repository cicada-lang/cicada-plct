import { applyClosure } from "../closure"
import { Ctx, ctxNames } from "../ctx"
import { ElaborationError, InternalError } from "../errors"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { assertClazz, conversion, inclusion, Value } from "../value"

/**

   # Comparing out of order Clazzes

   All properties in `clazz` must also occurs in `subclazz`.

   To compare out of order `Clazz`es,
   all we need is to prepare the `freshNames` first,
   because for example, in the case of `Sigma` in `conversionType`,
   all we need is to make sure that the `freshName` are the same
   when building the `TypedNeutral`.

**/

export function inclusionClazz(
  ctx: Ctx,
  subclazz: Values.Clazz,
  clazz: Values.Clazz,
): void {
  const freshNameMap = preparefreshNameMap(ctx, subclazz, clazz)

  const subclazzPropertyMap = buildPropertyMap(freshNameMap, subclazz)
  const clazzPropertyMap = buildPropertyMap(freshNameMap, clazz)

  for (const [name, clazzProperty] of clazzPropertyMap.entries()) {
    const subclazzProperty = subclazzPropertyMap.get(name)
    if (subclazzProperty === undefined) {
      throw new ElaborationError(
        `inclusionClazz found missing property on subclazz class: ${name}`,
      )
    }

    const freshName = freshNameMap.get(name)
    if (freshName === undefined) {
      throw new InternalError(
        "inclusionClazz freshName should have all the names from subclazz and clazz",
      )
    }

    if (
      subclazzProperty.value === undefined &&
      clazzProperty.value !== undefined
    ) {
      throw new ElaborationError(
        `inclusionClazz expect subclazzProperty to have fulfilled property: ${name}`,
      )
    }

    if (
      subclazzProperty.value !== undefined &&
      clazzProperty.value === undefined
    ) {
      inclusion(ctx, subclazzProperty.type, clazzProperty.type)
    }

    if (
      subclazzProperty.value === undefined &&
      clazzProperty.value === undefined
    ) {
      inclusion(ctx, subclazzProperty.type, clazzProperty.type)
    }

    if (
      subclazzProperty.value !== undefined &&
      clazzProperty.value !== undefined
    ) {
      inclusion(ctx, subclazzProperty.type, clazzProperty.type)
      const type = subclazzProperty.type
      conversion(ctx, type, subclazzProperty.value, clazzProperty.value)
    }
  }
}

type PropertyMap = Map<string, { type: Value; value?: Value }>

/**

   NOTE `buildPropertyMap` will do side-effects on `propertyMap`.

**/

function buildPropertyMap(
  freshNameMap: Map<string, string>,
  clazz: Values.Clazz,
  propertyMap: PropertyMap = new Map(),
): PropertyMap {
  switch (clazz.kind) {
    case "ClazzNull": {
      return propertyMap
    }

    case "ClazzCons": {
      propertyMap.set(clazz.name, {
        type: clazz.propertyType,
      })

      const freshName = freshNameMap.get(clazz.name)
      if (freshName === undefined) {
        throw new InternalError(
          `buildPropertyMap expect freshNameMap to have clazz.name: ${clazz.name}`,
        )
      }

      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(clazz.propertyType, variable)
      const rest = applyClosure(clazz.restClosure, typedNeutral)
      assertClazz(rest)
      return buildPropertyMap(freshNameMap, rest, propertyMap)
    }

    case "ClazzFulfilled": {
      propertyMap.set(clazz.name, {
        type: clazz.propertyType,
        value: clazz.property,
      })

      return buildPropertyMap(freshNameMap, clazz.rest, propertyMap)
    }
  }
}

function preparefreshNameMap(
  ctx: Ctx,
  subclazz: Values.Clazz,
  clazz: Values.Clazz,
): Map<string, string> {
  const freshNameMap = new Map()

  const subclazzNames = Values.clazzPropertyNames(subclazz)
  const clazzNames = Values.clazzPropertyNames(clazz)

  const used = new Set([...ctxNames(ctx), ...subclazzNames, ...clazzNames])

  for (const name of [...subclazzNames, ...clazzNames]) {
    const freshName = freshen(used, name)
    freshNameMap.set(name, freshName)
    used.add(freshName)
  }

  return freshNameMap
}
