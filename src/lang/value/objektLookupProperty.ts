import * as Actions from "../actions"
import { applyClosure } from "../closure"
import * as Errors from "../errors"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

export function objektLookupProperty(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value | undefined {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (clazz.propertyName === name)
        return Actions.doDot(target, clazz.propertyName)
      const property = Actions.doDot(target, clazz.propertyName)
      const rest = applyClosure(clazz.restClosure, property)
      assertClazz(rest)
      clazz = rest
    }

    if (clazz.kind === "ClazzFulfilled") {
      if (clazz.propertyName === name) return clazz.property
      clazz = clazz.rest
    }
  }

  return undefined
}

export function objektLookupPropertyOrFail(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value {
  const property = objektLookupProperty(target, clazz, name)
  if (property === undefined) {
    throw new Errors.EvaluationError(
      `[objektLookupPropertyOrFail] undefined property name: ${name}`,
    )
  }

  return property
}
