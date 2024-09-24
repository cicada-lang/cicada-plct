import * as Actions from "../actions/index.js"
import type * as Cores from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import type { Mod } from "../mod/index.js"
import { readback } from "../readback/index.js"
import type { Value } from "../value/index.js"
import * as Values from "../value/index.js"

export function readbackProperties(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  value: Value,
): Record<string, Cores.Core> {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      return {}
    }

    case "ClazzCons": {
      const propertyValue = Actions.doDot(value, clazz.propertyName)
      const propertyCore = readback(mod, ctx, clazz.propertyType, propertyValue)
      const rest = Values.clazzClosureApply(clazz.restClosure, propertyValue)
      return {
        [clazz.propertyName]: propertyCore,
        ...readbackProperties(mod, ctx, rest, value),
      }
    }

    case "ClazzFulfilled": {
      const propertyValue = Actions.doDot(value, clazz.propertyName)
      const propertyCore = readback(mod, ctx, clazz.propertyType, propertyValue)
      return {
        [clazz.propertyName]: propertyCore,
        ...readbackProperties(mod, ctx, clazz.rest, value),
      }
    }
  }
}
