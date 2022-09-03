import * as Actions from "../actions"
import { ElaborationError } from "../errors"
import * as Values from "../value"
import { applyClosure, assertValues, Value } from "../value"

export function lookupClazzProperty(
  clazz: Values.Clazz,
  target: Value,
  name: string
): Value | undefined {
  switch (clazz.kind) {
    case "ClazzNull": {
      return undefined
    }

    case "ClazzCons": {
      if (clazz.name === name) return Actions.doDot(target, clazz.name)

      const rest = applyClosure(
        clazz.restClosure,
        Actions.doDot(target, clazz.name)
      )

      assertValues(rest, [
        Values.ClazzNull,
        Values.ClazzCons,
        Values.ClazzFulfilled,
      ])

      return lookupClazzProperty(rest, target, name)
    }

    case "ClazzFulfilled": {
      if (clazz.name === name) return clazz.property

      return lookupClazzProperty(clazz.rest, target, name)
    }
  }
}

export function lookupClazzPropertyOrFail(
  clazz: Values.Clazz,
  target: Value,
  name: string
): Value {
  const property = lookupClazzProperty(clazz, target, name)
  if (property === undefined) {
    throw new ElaborationError(`Undefined property name: ${name}`)
  }

  return property
}
