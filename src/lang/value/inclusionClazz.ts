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
   all we need is to prepare the `freshNames` first (`preparefreshNameMap`),
   because for example, in the case of `Sigma` in `conversionType`,
   all we need is to make sure that the `freshName` are the same
   when building the `TypedNeutral`.

   Then we use `expelClazz` to expel all types and values from `Values.Clazz`,
   it returns a `Map`, so that the order does not matters anymore.

**/

export function inclusionClazz(
  ctx: Ctx,
  subclazz: Values.Clazz,
  clazz: Values.Clazz,
): void {
  const freshNameMap = preparefreshNameMap(ctx, subclazz, clazz)
  const subclazzPropertyMap = expelClazz(freshNameMap, subclazz)
  const clazzPropertyMap = expelClazz(freshNameMap, clazz)

  for (const [name, clazzProperty] of clazzPropertyMap.entries()) {
    const subclazzProperty = subclazzPropertyMap.get(name)
    if (subclazzProperty === undefined) {
      throw new ElaborationError(
        `inclusionClazz found missing property on subclazz class: ${name}`,
      )
    }

    inclusionProperty(ctx, subclazzProperty, clazzProperty)
  }
}

type Property = { type: Value; value?: Value }

type PropertyMap = Map<string, Property>

export function inclusionProperty(
  ctx: Ctx,
  subproperty: Property,
  property: Property,
): void {
  if (subproperty.value === undefined && property.value !== undefined) {
    throw new ElaborationError(
      `inclusionClazz expect subproperty to have fulfilled property: ${name}`,
    )
  }

  if (subproperty.value !== undefined && property.value === undefined) {
    inclusion(ctx, subproperty.type, property.type)
  }

  if (subproperty.value === undefined && property.value === undefined) {
    inclusion(ctx, subproperty.type, property.type)
  }

  if (subproperty.value !== undefined && property.value !== undefined) {
    inclusion(ctx, subproperty.type, property.type)
    conversion(ctx, subproperty.type, subproperty.value, property.value)
  }
}

/**

   NOTE `expelClazz` will do side-effects on `propertyMap`.

**/

function expelClazz(
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
          `expelClazz expect freshNameMap to have clazz.name: ${clazz.name}`,
        )
      }

      const variable = Neutrals.Var(freshName)
      const typedNeutral = Values.TypedNeutral(clazz.propertyType, variable)
      const rest = applyClosure(clazz.restClosure, typedNeutral)
      assertClazz(rest)
      return expelClazz(freshNameMap, rest, propertyMap)
    }

    case "ClazzFulfilled": {
      propertyMap.set(clazz.name, {
        type: clazz.propertyType,
        value: clazz.property,
      })

      return expelClazz(freshNameMap, clazz.rest, propertyMap)
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
