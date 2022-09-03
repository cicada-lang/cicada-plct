import * as Cores from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Values from "../value"
import { readback, readbackType } from "../value"

export function readbackClazz(ctx: Ctx, clazz: Values.Clazz): Cores.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      return Cores.ClazzNull()
    }

    case "ClazzCons": {
      throw new ElaborationError(
        `readbackType is not implemented for type: ${clazz.kind}`
      )
    }

    case "ClazzFulfilled": {
      return Cores.ClazzFulfilled(
        clazz.name,
        readbackType(ctx, clazz.propertyType),
        readback(ctx, clazz.propertyType, clazz.property),
        readbackClazz(ctx, clazz.rest)
      )
    }
  }
}
