import { MetaVar } from "../solution"
import { Value } from "../value"

export class Solution {
  metaVars: Array<MetaVar> = []
  bindings: Map<string, Value> = new Map()
}
