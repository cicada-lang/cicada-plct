import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Exp } from "../exp"
import * as Values from "../value"
import { check } from "./check"

export function checkClazzArg(ctx: Ctx, clazz: Values.Clazz, arg: Exp): Core {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new ElaborationError("cannot apply argument to ClazzNull")
    }

    case "ClazzCons": {
      return check(ctx, arg, clazz.propertyType)
    }

    case "ClazzFulfilled": {
      return checkClazzArg(ctx, clazz.rest, arg)
    }
  }
}
