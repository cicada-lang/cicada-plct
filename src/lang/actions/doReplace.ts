import * as Actions from "../actions"
import { ClosureNative } from "../closure"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { TypedValue, Value } from "../value"

export function doReplace(target: Value, motive: Value, base: Value): Value {
  if (target.kind === "Refl") {
    return base
  }

  Values.assertValue(target, "TypedNeutral")
  Values.assertValue(target.type, "Equal")

  const baseType = Actions.doAp(motive, target.type.from)
  const motiveType = Values.Pi(
    target.type.type,
    ClosureNative("target", () => Values.Type()),
  )

  return Values.TypedNeutral(
    Actions.doAp(motive, target.type.to),
    Neutrals.Replace(
      target.neutral,
      target.type,
      TypedValue(motiveType, motive),
      TypedValue(baseType, base),
    ),
  )
}
