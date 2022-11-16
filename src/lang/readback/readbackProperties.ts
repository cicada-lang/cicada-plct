import * as Actions from "../actions"
import type * as Cores from "../core"
import type { Ctx } from "../ctx"
import type { Mod } from "../mod"
import { readback } from "../readback"
import type { Value } from "../value"
import * as Values from "../value"

export function readbackProperties(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  value: Value,
): Record<string, Cores.Core> {
  switch (clazz.kind) {
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
