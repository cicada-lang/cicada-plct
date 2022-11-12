import { indent } from "../../utils/indent"
import { applyClosure } from "../closure"
import { Ctx, CtxCons, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { unifyType } from "../unify"
import { freshen } from "../utils/freshen"
import { formatType, Value } from "../value"
import * as Insertions from "./Insertion"
import { Insertion } from "./Insertion"

export function solveByRetType(
  mod: Mod,
  ctx: Ctx,
  type: Value,
  retType: Value,
): Array<Insertion> {
  const insertions: Array<Insertion> = []
  while (type.kind === "PiImplicit") {
    try {
      unifyType(mod, ctx, type, retType)
      return insertions
    } catch (_error) {
      const name = type.retTypeClosure.name
      // TODO Scope BUG, `freshName` might occurs in `args`.
      const usedNames = [...ctxNames(ctx), ...mod.solution.names]
      const freshName = freshen(usedNames, name)
      const patternVar = mod.solution.createPatternVar(freshName, type.argType)
      ctx = CtxCons(freshName, type.argType, ctx)
      type = applyClosure(type.retTypeClosure, patternVar)
      insertions.push(Insertions.InsertionPatternVar(patternVar))
    }
  }

  try {
    unifyType(mod, ctx, type, retType)
    return insertions
  } catch (error) {
    if (
      error instanceof Errors.UnificationError ||
      error instanceof Errors.InclusionError
    ) {
      throw new Errors.ElaborationError(
        [
          `[solveByRetType] fail`,
          // indent(`var name: ${exp.name}`),
          indent(`inferred target type: ${formatType(mod, ctx, type)}`),
          indent(`return type: ${formatType(mod, ctx, retType)}`),
          ...error.trace,
          error.message,
        ].join("\n"),
        { span: undefined },
      )
    }

    throw error
  }
}
