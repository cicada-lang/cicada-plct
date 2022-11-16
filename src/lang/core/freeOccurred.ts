import type { Core } from "../core"
import { freeNames } from "../core"

export function freeOccurred(name: string, core: Core): boolean {
  return freeNames(new Set(), core).has(name)
}
