import { Ctx } from "../ctx"
import { conversionType, Value } from "../value"

export function conversionByType(
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): "ok" | undefined {
  switch (type.kind) {
    case "Type": {
      conversionType(ctx, left, right)
      return "ok"
    }

    case "Trivial": {
      return "ok"
    }
  }
}
