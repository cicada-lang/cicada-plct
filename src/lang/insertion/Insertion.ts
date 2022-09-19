import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import {
  deepWalk,
  lookupValueInSolution,
  PatternVar,
  Solution,
} from "../solution"
import { readback } from "../value"

export type Insertion =
  | InsertionPatternVar
  | InsertionUsedArg
  | InsertionImplicitArg

export type InsertionPatternVar = {
  kind: "InsertionPatternVar"
  patternVar: PatternVar
}

export function InsertionPatternVar(
  patternVar: PatternVar,
): InsertionPatternVar {
  return {
    kind: "InsertionPatternVar",
    patternVar,
  }
}

export type InsertionUsedArg = {
  kind: "InsertionUsedArg"
  argCore: Core
}

export function InsertionUsedArg(argCore: Core): InsertionUsedArg {
  return {
    kind: "InsertionUsedArg",
    argCore,
  }
}

export type InsertionImplicitArg = {
  kind: "InsertionImplicitArg"
  argCore: Core
}

export function InsertionImplicitArg(argCore: Core): InsertionImplicitArg {
  return {
    kind: "InsertionImplicitArg",
    argCore,
  }
}

export function applyInsertion(
  solution: Solution,
  ctx: Ctx,
  insertion: Insertion,
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
