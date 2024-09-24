import type { Core } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import { ctxToEnv } from "../ctx/index.js"
import { evaluate } from "../evaluate/index.js"
import type { Exp } from "../exp/index.js"
import { infer, Inferred } from "../infer/index.js"
import type { Mod } from "../mod/index.js"
import * as Values from "../value/index.js"

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
