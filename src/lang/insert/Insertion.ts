import { Core } from "../core"
import { Exp } from "../exp"
import { PatternVar } from "../solution"

export type Insertion =
  | InsertionPatternVar
  | InsertionUsedArg
  | InsertionImplicitArg

export type InsertionPatternVar = {
  kind: "InsertionPatternVar"
  patternVar: PatternVar
  argExp?: Exp
}

export function InsertionPatternVar(
  patternVar: PatternVar,
  argExp?: Exp,
): InsertionPatternVar {
  return {
    kind: "InsertionPatternVar",
    patternVar,
    argExp,
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
