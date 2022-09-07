import { Ctx, CtxCons, CtxFulfilled, ctxNames } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import {
  applyClosure,
  assertClazz,
  conversion,
  inclusion,
  Value,
} from "../value"

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

export function conversionClazz(
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): void {
  const nameMap = prepareNameMap(ctx, left, right)

  const leftPropertyMap = buildPropertyMap(nameMap, left, new Map())
  const rightPropertyMap = buildPropertyMap(nameMap, right, new Map())

  for (const [name, localName] of nameMap.entries()) {
    const leftProperty = leftPropertyMap.get(name)
    if (leftProperty === undefined) {
      throw new ElaborationError(
        `conversionClazz found missing property on left class: ${name}`,
      )
    }

    const rightProperty = rightPropertyMap.get(name)
    if (rightProperty === undefined) {
      throw new ElaborationError(
        `conversionClazz found missing property on right class: ${name}`,
      )
    }

    if (leftProperty.value !== undefined && rightProperty.value === undefined) {
      throw new ElaborationError(
        `conversionClazz expect leftProperty to have value: ${name}`,
      )
    }

    if (leftProperty.value === undefined && rightProperty.value !== undefined) {
      throw new ElaborationError(
        `conversionClazz expect rightProperty to have value: ${name}`,
      )
    }

    if (leftProperty.value === undefined && rightProperty.value === undefined) {
      inclusion(ctx, leftProperty.type, rightProperty.type)
      const type = leftProperty.type
      ctx = CtxCons(localName, type, ctx)
    }

    if (leftProperty.value !== undefined && rightProperty.value !== undefined) {
      inclusion(ctx, leftProperty.type, rightProperty.type)
      const type = leftProperty.type
      conversion(ctx, type, leftProperty.value, rightProperty.value)
      const value = leftProperty.value
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
  left: Values.Clazz,
  right: Values.Clazz,
): Map<string, string> {
  const nameMap = new Map()

  const leftNames = Values.clazzPropertyNames(left)
  const rightNames = Values.clazzPropertyNames(right)

  const used = new Set([...ctxNames(ctx), ...leftNames, ...rightNames])

  for (const name of [...leftNames, ...rightNames]) {
    const freshName = freshen(used, name)
    nameMap.set(name, freshName)
    used.add(freshName)
  }

  return nameMap
}
