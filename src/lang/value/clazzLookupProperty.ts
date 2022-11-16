import * as Actions from "../actions"
import * as Errors from "../errors"
import * as Values from "../value"
import { Value } from "../value"

export function clazzLookupProperty(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value | undefined {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (clazz.propertyName === name) return undefined
      const property = Actions.doDot(target, clazz.propertyName)
      clazz = Values.clazzClosureApply(clazz.restClosure, property)
    }

    if (clazz.kind === "ClazzFulfilled") {
      if (clazz.propertyName === name) return clazz.property
      clazz = clazz.rest
    }
  }

  return undefined
}

export function clazzLookupPropertyOrFail(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value {
  const property = clazzLookupProperty(target, clazz, name)
  if (property === undefined) {
    throw new Errors.EvaluationError(
      `[clazzLookupPropertyOrFail] undefined property name: ${name}`,
    )
  }

  return property
}
