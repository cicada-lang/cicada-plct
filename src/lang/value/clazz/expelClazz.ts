import { applyClosure } from "../../closure"
import { InternalError } from "../../errors"
import * as Neutrals from "../../neutral"
import * as Values from "../../value"
import { assertClazz, Value } from "../../value"

type Property = { type: Value; value?: Value }

type PropertyMap = Map<string, Property>

export function expelClazz(
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
