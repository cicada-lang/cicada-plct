import * as Cores from "../core"
import { Core } from "../core"
import * as Errors from "../errors"

export function assertClazz(core: Core): asserts core is Cores.Clazz {
  if (core.kind === "ClazzNull") return
  if (core.kind === "ClazzCons") return
  if (core.kind === "ClazzFulfilled") return

  throw new Errors.AssertionError(
    `expect core to be clazz instead of: ${core.kind}`,
  )
}
