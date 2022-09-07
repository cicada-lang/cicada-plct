import { applyClosure } from "../closure"
import { Ctx, CtxCons, CtxFulfilled, ctxNames } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { assertClazz, conversion, inclusion, Value } from "../value"

/**

   # Comparing out of order Clazzes

   To compare out of order `Clazz`es,
   all we need is to prepare the `freshNames` first,
   because for example, in the case of `Sigma` in `conversionType`,
   all we need is to make sure that the `freshName` are the same
   when building the `TypedNeutral`.

**/

/**

   TODO Functions in this module need refactorings.

**/

export function inclusionClazz(
  ctx: Ctx,
  subclazz: Values.Clazz,
  clazz: Values.Clazz,
): void {
  const nameMap = prepareNameMap(ctx, subclazz, clazz)

  const subclazzPropertyMap = buildPropertyMap(nameMap, subclazz, new Map())
  const clazzPropertyMap = buildPropertyMap(nameMap, clazz, new Map())

  for (const [name, localName] of nameMap.entries()) {
    const subclazzProperty = subclazzPropertyMap.get(name)
    if (subclazzProperty === undefined) {
      throw new ElaborationError(
        `inclusionClazz found missing property on subclazz class: ${name}`,
      )
    }

    const clazzProperty = clazzPropertyMap.get(name)
    if (clazzProperty === undefined) {
      throw new ElaborationError(
        `inclusionClazz found missing property on clazz class: ${name}`,
      )
    }

    if (
      subclazzProperty.value !== undefined &&
      clazzProperty.value === undefined
    ) {
      throw new ElaborationError(
        `inclusionClazz expect subclazzProperty to have value: ${name}`,
      )
    }

    if (
      subclazzProperty.value === undefined &&
      clazzProperty.value !== undefined
    ) {
      throw new ElaborationError(
        `inclusionClazz expect clazzProperty to have value: ${name}`,
      )
    }

    if (
      subclazzProperty.value === undefined &&
      clazzProperty.value === undefined
    ) {
      inclusion(ctx, subclazzProperty.type, clazzProperty.type)
      const type = subclazzProperty.type
      ctx = CtxCons(localName, type, ctx)
    }

    if (
      subclazzProperty.value !== undefined &&
      clazzProperty.value !== undefined
    ) {
      inclusion(ctx, subclazzProperty.type, clazzProperty.type)
      const type = subclazzProperty.type
      conversion(ctx, type, subclazzProperty.value, clazzProperty.value)
      const value = subclazzProperty.value
      ctx = CtxFulfilled(localName, type, value, ctx)
    }
  }
}

type PropertyMap = Map<string, { type: Value; value?: Value }>

// NOTE Side-effect on propertyMap
function buildPropertyMap(
  nameMap: Map<string, string>,
  clazz: Values.Clazz,
  propertyMap: PropertyMap,
): PropertyMap {
  switch (clazz.kind) {
    case "ClazzNull": {
      return propertyMap
    }

    case "ClazzCons": {
      propertyMap.set(clazz.name, {
        type: clazz.propertyType,
      })

      const freshName = nameMap.get(clazz.name)
      if (freshName === undefined) {
        throw new Error(
          `internal error, expect nameMap to have clazz.name: ${clazz.name}`,
        )
      }

      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(clazz.propertyType, variable)

      const rest = applyClosure(clazz.restClosure, typedNeutral)

      assertClazz(rest)

      return buildPropertyMap(nameMap, rest, propertyMap)
    }

    case "ClazzFulfilled": {
      propertyMap.set(clazz.name, {
        type: clazz.propertyType,
        value: clazz.property,
      })

      return buildPropertyMap(nameMap, clazz.rest, propertyMap)
    }
  }
}

function prepareNameMap(
  ctx: Ctx,
  subclazz: Values.Clazz,
  clazz: Values.Clazz,
): Map<string, string> {
  const nameMap = new Map()

  const subclazzNames = Values.clazzPropertyNames(subclazz)
  const clazzNames = Values.clazzPropertyNames(clazz)

  const used = new Set([...ctxNames(ctx), ...subclazzNames, ...clazzNames])

  for (const name of [...subclazzNames, ...clazzNames]) {
    const freshName = freshen(used, name)
    nameMap.set(name, freshName)
    used.add(freshName)
  }

  return nameMap
}
