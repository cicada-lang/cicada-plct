import { Core } from "./Core"
import { Ctx } from "./Ctx"
import { Exp } from "./Exp"
import { Value } from "./Value"

export function infer(ctx: Ctx, exp: Exp): { type: Value; core: Core } {
  throw new Error("TODO")
}
