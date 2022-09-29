import { Core, freeNames } from "../core"

export function freeOccurred(name: string, core: Core): boolean {
  return freeNames(new Set(), core).has(name)
}
