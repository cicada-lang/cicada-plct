import type { Core } from "../core/index.js"
import { freeNames } from "../core/index.js"

export function freeOccurred(name: string, core: Core): boolean {
  return freeNames(new Set(), core).has(name)
}
