import * as Actions from "../actions"
import { applyClosure } from "../closure"
import * as Errors from "../errors"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

export function clazzLookupProperty(
  target: Value,
  clazz: Values.Clazz,
  name: string,
): Value | undefined {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (clazz.name === name) return undefined
      const property = Actions.doDot(target, clazz.name)
      const rest = applyClosure(clazz.restClosure, property)
      assertClazz(rest)
      clazz = rest
    }

    if (clazz.kind === "ClazzFulfilled") {
      if (clazz.name === name) return clazz.property
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
