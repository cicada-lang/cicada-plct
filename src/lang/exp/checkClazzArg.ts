import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Exp } from "../exp"
import { Solution } from "../solution"
import * as Values from "../value"
import { check } from "./check"

export function checkClazzArg(
  solution: Solution,
  ctx: Ctx,
  clazz: Values.Clazz,
  arg: Exp,
): Core {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new ElaborationError("cannot apply argument to ClazzNull")
    }

    case "ClazzCons": {
      return check(solution, ctx, arg, clazz.propertyType)
    }

    case "ClazzFulfilled": {
      return checkClazzArg(solution, ctx, clazz.rest, arg)
    }
  }
}
