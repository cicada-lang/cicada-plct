import * as Errors from "../errors"
import * as Neutrals from "../neutral"
import type { Value } from "../value"
import * as Values from "../value"

export function doDot(target: Value, name: string): Value {
  if (target.kind === "Objekt") {
    const property = target.properties[name]
    if (property === undefined) {
      throw new Errors.EvaluationError(
        `[doDot] undefined property name: ${name}`,
      )
    }

    return property
  }

  Values.assertValues(target, ["TypedNeutral"])

  if (!Values.isClazz(target.type)) {
    throw new Errors.EvaluationError(
      [
        `[doDot] When target is a TypedNeutral, expect target.type to be Clazz`,
        `  target.type.kind: ${target.type.kind}`,
      ].join("\n"),
    )
  }

  return Values.TypedNeutral(
    Values.clazzLookupPropertyTypeOrFail(target, target.type, name),
    Neutrals.Dot(target.neutral, target.type, name),
  )
}
