import * as Cores from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { unifyNeutral } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function unifyByValue(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): void {
  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    // unifyNeutral(mod, ctx, left.neutral, right.neutral)
    // return

    try {
      unifyNeutral(mod, ctx, left.neutral, right.neutral)
      return
    } catch (error) {
      console.log("------")
      console.log(
        " type :",
        Cores.formatCore(Values.readbackType(mod, ctx, type)),
      )
      console.log(
        " left :",
        Cores.formatCore(Values.readback(mod, ctx, type, left)),
      )
      console.log(
        "right :",
        Cores.formatCore(Values.readback(mod, ctx, type, right)),
      )
      throw error
    }
  }

  if (left.kind === "Sole" && right.kind === "Sole") {
    return
  }

  if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.data === right.data) {
      return
    }

    throw new Errors.UnificationError(
      `unifyByValue expect left.data: ${left.data} to be the same as right.data: ${right.data}`,
    )
  }

  throw new Errors.UnificationError(
    `unifyByValue is not implemented for type: ${type.kind}, left: ${left.kind}, right: ${right.kind}`,
  )
}
