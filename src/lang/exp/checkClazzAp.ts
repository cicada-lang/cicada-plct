import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Values from "../value"
import { check } from "./check"
import { Exp } from "./Exp"

export function checkClazzAp(ctx: Ctx, clazz: Values.Clazz, arg: Exp): Core {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new ElaborationError("cannot apply argument to ClazzNull")
    }

    case "ClazzCons": {
      return check(ctx, arg, clazz.propertyType)
    }

    case "ClazzFulfilled": {
      return checkClazzAp(ctx, clazz.rest, arg)
    }
  }
}
