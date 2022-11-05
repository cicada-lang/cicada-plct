export { Span } from "@cicada-lang/partech"

import { Span } from "@cicada-lang/partech"

export function spanUnion(left?: Span, right?: Span): Span | undefined {
  if (left === undefined) return right
  if (right === undefined) return left
  return { lo: left.lo, hi: right.hi }
}
