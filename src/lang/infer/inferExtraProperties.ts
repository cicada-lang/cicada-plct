import type { Core } from "../core"
import { Ctx, ctxToEnv } from "../ctx"
import { evaluate } from "../evaluate"
import type { Exp } from "../exp"
import { infer, Inferred } from "../infer"
import { Mod } from "../mod"
import * as Values from "../value"

export function inferExtraProperties(
  mod: Mod,
  ctx: Ctx,
  properties: Record<string, Exp>,
  names: Array<string>,
): { clazz: Values.Clazz; properties: Record<string, Core> } {
  const extraInferred = Object.entries(properties)
    .filter(([name, exp]) => !names.includes(name))
    .map(([name, exp]): [string, Inferred] => [name, infer(mod, ctx, exp)])
  const extraProperties = Object.fromEntries(
    extraInferred.map(([name, inferred]) => [name, inferred.core]),
  )

  const extraTypedValues = Object.fromEntries(
    extraInferred.map(([name, inferred]) => [
      name,
      {
        type: inferred.type,
        value: evaluate(ctxToEnv(ctx), inferred.core),
      },
    ]),
  )

  return {
    clazz: Values.clazzFromTypedValues(extraTypedValues),
    properties: extraProperties,
  }
}
