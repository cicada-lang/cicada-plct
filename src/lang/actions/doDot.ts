import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import type { Value } from "../value"
import * as Values from "../value"

export function doDot(target: Value, name: string): Value {
  return tryDot(target, name) || neutralizeDot(target, name)
}

export function tryDot(target: Value, name: string): Value | undefined {
  if (target.kind === "Objekt") {
    const property = target.properties[name]
    if (property === undefined) {
      throw new Errors.EvaluationError(
        `[tryDot] undefined property name: ${name}`,
      )
    }

    return property
  }
}

export function neutralizeDot(target: Value, name: string): Value {
  if (target.kind !== "TypedNeutral") {
    throw new Errors.EvaluationError(
      [
        `[neutralizeDot] expect target to be TypedNeutral`,
        `  target.kind: ${target.kind}`,
      ].join("\n"),
    )
  }

  if (!Values.isClazz(target.type)) {
    throw new Errors.EvaluationError(
      [
        `[neutralizeDot] When target is a TypedNeutral, expect target.type to be Clazz`,
        `  target.type.kind: ${target.type.kind}`,
      ].join("\n"),
    )
  }

  const propertyType = Values.clazzLookupPropertyType(target, target.type, name)
  if (propertyType === undefined) {
    throw new Errors.EvaluationError(
      `[neutralizeDot] undefined property: ${name}`,
    )
  }

  return Values.TypedNeutral(
    propertyType,
    Neutrals.Dot(target.neutral, target.type, name),
  )
}
