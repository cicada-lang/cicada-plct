import { Exp } from "./Exp"
import { Core } from "./Core"
import { Value } from "./Value"
import { Ctx } from "./Ctx"

export function infer(ctx: Ctx, exp: Exp): { t: Value; core: Core } {
  throw new Error("TODO")
}
