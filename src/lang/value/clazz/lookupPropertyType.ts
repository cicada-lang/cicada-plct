import * as Actions from "../../actions"
import { applyClosure } from "../../closure"
import { ElaborationError } from "../../errors"
import * as Values from "../../value"
import { assertClazz, Value } from "../../value"

export function lookupPropertyType(
  clazz: Values.Clazz,
  target: Value,
  name: string,
): Value | undefined {
  switch (clazz.kind) {
    case "ClazzNull": {
      return undefined
    }

    case "ClazzCons": {
      if (clazz.name === name) return clazz.propertyType

      const rest = applyClosure(
        clazz.restClosure,
        Actions.doDot(target, clazz.name),
      )

      assertClazz(rest)

      return lookupPropertyType(rest, target, name)
    }

    case "ClazzFulfilled": {
      if (clazz.name === name) return clazz.propertyType

      return lookupPropertyType(clazz.rest, target, name)
    }
  }
}

export function lookupPropertyTypeOrFail(
  clazz: Values.Clazz,
  target: Value,
  name: string,
): Value {
  const propertyType = lookupPropertyType(clazz, target, name)
  if (propertyType === undefined) {
    throw new ElaborationError(`Undefined property type name: ${name}`)
  }

  return propertyType
}
