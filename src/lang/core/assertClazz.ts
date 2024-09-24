import type * as Cores from "../core/index.js"
import type { Core } from "../core/index.js"
import * as Errors from "../errors/index.js"

export function assertClazz(core: Core): asserts core is Cores.Clazz {
  if (core["@kind"] === "ClazzNull") return
  if (core["@kind"] === "ClazzCons") return
  if (core["@kind"] === "ClazzFulfilled") return

  throw new Errors.AssertionError(
    `expect core to be clazz instead of: ${core["@kind"]}`,
  )
}
