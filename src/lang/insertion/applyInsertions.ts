import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Insertions from "../insertion"
import { deepWalk, lookupValueInSolution, Solution } from "../solution"
import { readback } from "../value"

export function applyInsertions(
  solution: Solution,
  ctx: Ctx,
  insertions: Array<Insertions.Insertion>,
  core: Core,
): Core {
  for (const insertion of insertions) {
    core = applyInsertion(solution, ctx, insertion, core)
  }

  return core
}

function applyInsertion(
  solution: Solution,
  ctx: Ctx,
  insertion: Insertions.Insertion,
  core: Core,
): Core {
  switch (insertion.kind) {
    case "InsertionPatternVar": {
      let argValue = lookupValueInSolution(
        solution,
        insertion.patternVar.neutral.name,
      )
      if (argValue === undefined) {
        throw new ElaborationError(
          `Unsolved patternVar: ${insertion.patternVar.neutral.name}`,
        )
      }

      const argCore = readback(
        ctx,
        deepWalk(solution, ctx, insertion.patternVar.type),
        deepWalk(solution, ctx, argValue),
      )

      return Cores.ImplicitAp(core, argCore)
    }

    case "InsertionUsedArg": {
      return Cores.Ap(core, insertion.argCore)
    }

    case "InsertionImplicitArg": {
      return Cores.ImplicitAp(core, insertion.argCore)
    }
  }
}
