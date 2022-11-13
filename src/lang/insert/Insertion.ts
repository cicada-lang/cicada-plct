import { Core } from "../core"
import { Exp } from "../exp"
import { MetaVar } from "../solution"

export type Insertion =
  | InsertionMetaVar
  | InsertionUsedArg
  | InsertionImplicitArg

export type InsertionMetaVar = {
  kind: "InsertionMetaVar"
  metaVar: MetaVar
  argExp?: Exp
}

export function InsertionMetaVar(
  metaVar: MetaVar,
  argExp?: Exp,
): InsertionMetaVar {
  return {
    kind: "InsertionMetaVar",
    metaVar,
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
