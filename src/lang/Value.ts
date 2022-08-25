import { Neutral } from "./Neutral"

export type Value = NotYetValue

export type NotYetValue = {
  kind: "NotYetValue"
  t: Value
  Neutral: Neutral
}

export function NotYetValue(t: Value, Neutral: Neutral) {
  return { kind: "NotYetValue", t, Neutral }
}
