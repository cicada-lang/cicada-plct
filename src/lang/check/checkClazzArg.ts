import type { Core } from "../core"
import type { Ctx } from "../ctx"
import * as Errors from "../errors"
import type { Exp } from "../exp"
import { Mod } from "../mod"
import * as Values from "../value"
import { check } from "./check"

export function checkClazzArg(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  arg: Exp,
): Core {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new Errors.ElaborationError(
        "[checkClazzArg] cannot apply argument to ClazzNull",
        { span: arg.span },
      )
    }

    case "ClazzCons": {
      return check(mod, ctx, arg, clazz.propertyType)
    }

    case "ClazzFulfilled": {
      return checkClazzArg(mod, ctx, clazz.rest, arg)
    }
  }
}
