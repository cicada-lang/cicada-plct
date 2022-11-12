import { Core } from "../core"
import { PatternVar } from "../solution"

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
