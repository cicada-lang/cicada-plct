import { applyClosure } from "../../closure"
import * as Errors from "../../errors"
import * as Neutrals from "../../neutral"
import * as Values from "../../value"
import { assertClazz, Value } from "../../value"

type Property = { type: Value; value?: Value }

type PropertyMap = Map<string, Property>

export function clazzExpel(
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
        throw new Errors.InternalError(
          `clazzExpel expect freshNameMap to have clazz.name: ${clazz.name}`,
        )
      }

      const v = Values.TypedNeutral(clazz.propertyType, Neutrals.Var(freshName))
      const rest = applyClosure(clazz.restClosure, v)
      assertClazz(rest)
      return clazzExpel(freshNameMap, rest, propertyMap)
    }

    case "ClazzFulfilled": {
      propertyMap.set(clazz.name, {
        type: clazz.propertyType,
        value: clazz.property,
      })

      return clazzExpel(freshNameMap, clazz.rest, propertyMap)
    }
  }
}
