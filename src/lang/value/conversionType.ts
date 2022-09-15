import { Ctx } from "../ctx"
import * as Values from "../value"
import { conversion, Value } from "../value"

export function conversionType(ctx: Ctx, left: Value, right: Value): void {
  conversion(ctx, Values.Type(), left, right)
}
