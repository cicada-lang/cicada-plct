import type { Value } from "../value/index.js"

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
