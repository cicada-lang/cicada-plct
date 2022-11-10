import * as Actions from "../actions"
import { applyClosure } from "../closure"
import * as Errors from "../errors"
import * as Values from "../value"
import { assertClazz, Value } from "../value"

export function lookupProperty(
  clazz: Values.Clazz,
  target: Value,
  name: string,
): Value | undefined {
  while (clazz.kind !== "ClazzNull") {
    if (clazz.kind === "ClazzCons") {
      if (clazz.name === name) return Actions.doDot(target, clazz.name)

      const rest = applyClosure(
        clazz.restClosure,
        Actions.doDot(target, clazz.name),
      )

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

export function lookupPropertyOrFail(
  clazz: Values.Clazz,
  target: Value,
  name: string,
): Value {
  const property = lookupProperty(clazz, target, name)
  if (property === undefined) {
    throw new Errors.EvaluationError(`Undefined property name: ${name}`)
  }

  return property
}
