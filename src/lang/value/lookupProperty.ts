import * as Actions from "../actions"
import { ElaborationError } from "../errors"
import * as Values from "../value"
import { applyClosure, assertClazz, Value } from "../value"

export function lookupProperty(
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

      assertClazz(rest)

      return lookupProperty(rest, target, name)
    }

    case "ClazzFulfilled": {
      if (clazz.name === name) return clazz.property

      return lookupProperty(clazz.rest, target, name)
    }
  }
}

export function lookupPropertyOrFail(
  clazz: Values.Clazz,
  target: Value,
  name: string
): Value {
  const property = lookupProperty(clazz, target, name)
  if (property === undefined) {
    throw new ElaborationError(`Undefined property name: ${name}`)
  }

  return property
}
