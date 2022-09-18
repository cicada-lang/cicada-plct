import { Value } from "../value"

export class Solution {
  bindings: Map<string, Value> = new Map()

  get names(): Array<string> {
    return Array.from(this.bindings.keys())
  }

  lookupValue(name: string): Value | undefined {
    return this.bindings.get(name)
  }
}
