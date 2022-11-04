import { Value } from "../value"

export type TypedValue = {
  type: Value
  value: Value
}

export function TypedValue(type: Value, value: Value): TypedValue {
  return {
    type,
    value,
  }
}
