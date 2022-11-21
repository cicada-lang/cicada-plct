import type { Core } from "../core"
import type { Exp } from "../exp"
import type * as Values from "../value"

export type Insertion =
  | InsertionMetaVar
  | InsertionUsedArg
  | InsertionImplicitArg

export type InsertionMetaVar = {
  "@kind": "InsertionMetaVar"
  metaVar: Values.MetaVar
  argExp?: Exp
}

export function InsertionMetaVar(
  metaVar: Values.MetaVar,
  argExp?: Exp,
): InsertionMetaVar {
  return {
    "@kind": "InsertionMetaVar",
    metaVar,
    argExp,
  }
}

export type InsertionUsedArg = {
  "@kind": "InsertionUsedArg"
  argCore: Core
}

export function InsertionUsedArg(argCore: Core): InsertionUsedArg {
  return {
    "@kind": "InsertionUsedArg",
    argCore,
  }
}

export type InsertionImplicitArg = {
  "@kind": "InsertionImplicitArg"
  argCore: Core
}

export function InsertionImplicitArg(argCore: Core): InsertionImplicitArg {
  return {
    "@kind": "InsertionImplicitArg",
    argCore,
  }
}
