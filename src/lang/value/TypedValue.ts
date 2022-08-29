import { Value } from "./Value"

export type TypedValue = {
  family: "TypedValue"
  type: Value
  value: Value
}

export function TypedValue(type: Value, value: Value): TypedValue {
  return {
    family: "TypedValue",
    type,
    value,
  }
}
