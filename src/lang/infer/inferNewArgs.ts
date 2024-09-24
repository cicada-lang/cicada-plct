import { check } from "../check/index.js"
import type { Core } from "../core/index.js"
import type { Ctx } from "../ctx/index.js"
import { CtxCons, ctxToEnv } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import { evaluate } from "../evaluate/index.js"
import type * as Exps from "../exp/index.js"
import type { Mod } from "../mod/index.js"
import { readback } from "../readback/index.js"
import * as Values from "../value/index.js"

export function inferNewArgs(
  mod: Mod,
  ctx: Ctx,
  args: Array<Exps.Arg>,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      if (args.length !== 0) {
        throw new Errors.ElaborationError(
          `[inferNewArgs] too many arguments when calling new`,
          {},
        )
      }

      return {}
    }

    case "ClazzCons": {
      if (args.length === 0) {
        throw new Errors.ElaborationError(
          `[inferNewArgs] not enough arguments when calling new, require property: ${clazz.propertyName}`,
          {},
        )
      }

      const [arg, ...restArgs] = args
      const propertyCore = check(mod, ctx, arg.exp, clazz.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      const rest = Values.clazzClosureApply(clazz.restClosure, propertyValue)
      ctx = CtxCons(clazz.propertyName, clazz.propertyType, ctx)
      return {
        [clazz.propertyName]: propertyCore,
        ...inferNewArgs(mod, ctx, restArgs, rest),
      }
    }

    case "ClazzFulfilled": {
      const propertyCore = readback(
        mod,
        ctx,
        clazz.propertyType,
        clazz.property,
      )

      return {
        [clazz.propertyName]: propertyCore,
        ...inferNewArgs(mod, ctx, args, clazz.rest),
      }
    }
  }
}
