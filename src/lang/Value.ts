import { Neutral } from "./Neutral"

export type Value = NotYetValue

export type NotYetValue = {
  kind: "NotYetValue"
  type: Value
  Neutral: Neutral
}

export function NotYetValue(type: Value, Neutral: Neutral) {
  return {
    kind: "NotYetValue",
    type,
    Neutral,
  }
}
