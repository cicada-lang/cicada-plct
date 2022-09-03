import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import {
  assertClazz,
  assertValue,
  isValue,
  lookupPropertyTypeOrFail,
  Value,
} from "../value"

export function doDot(target: Value, name: string): Value {
  if (isValue(target, Values.Objekt)) {
    const property = target.properties[name]
    if (property === undefined) {
      throw new ElaborationError(`Undefined property name: ${name}`)
    }

    return property
  }

  assertValue(target, Values.TypedNeutral)
  assertClazz(target.type)

  return Values.TypedNeutral(
    lookupPropertyTypeOrFail(target.type, target, name),
    Neutrals.Dot(target.neutral, name),
  )
}
