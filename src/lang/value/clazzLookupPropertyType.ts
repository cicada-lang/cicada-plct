import * as Actions from "../actions"
import * as Errors from "../errors"
import type { Value } from "../value"
import * as Values from "../value"

export function clazzLookupPropertyType(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value | undefined {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (clazz.propertyName === name) return clazz.propertyType
      const property = Actions.doDot(target, clazz.propertyName)
      clazz = Values.clazzClosureApply(clazz.restClosure, property)
    }

    if (clazz.kind === "ClazzFulfilled") {
      if (clazz.propertyName === name) return clazz.propertyType
      clazz = clazz.rest
    }
  }

  return undefined
}

export function clazzLookupPropertyTypeOrFail(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value {
  const propertyType = clazzLookupPropertyType(target, clazz, name)
  if (propertyType === undefined) {
    throw new Errors.EvaluationError(
      `[clazzLookupPropertyTypeOrFail] undefined property type name: ${name}`,
    )
  }

  return propertyType
}
