import { applyClosure } from "../closure"
import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import { createPatternVar, PatternVar } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function collectPatternVars(
  ctx: Ctx,
  type: Value,
  patternVars: Array<PatternVar> = [],
): {
  ctx: Ctx
  type: Value
  patternVars: Array<PatternVar>
} {
  if (Values.isValue(type, Values.ImplicitPi)) {
    const freshName = freshenInCtx(ctx, type.retTypeClosure.name)
    const patternVar = createPatternVar(type.argType, freshName)
    return collectPatternVars(
      CtxCons(freshName, type.argType, ctx),
      applyClosure(type.retTypeClosure, patternVar),
      [...patternVars, patternVar],
    )
  }

  return { patternVars, type, ctx }
}
