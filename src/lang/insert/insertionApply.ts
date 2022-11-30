import type { Core } from "../core"
import * as Cores from "../core"
import type { Ctx } from "../ctx"
import * as Errors from "../errors"
import type { Insertion } from "../insert"
import type { Mod } from "../mod"
import { readback } from "../readback"
import { solutionLookupValue } from "../solution"

export function insertionApply(
  mod: Mod,
  ctx: Ctx,
  insertion: Insertion,
  core: Core,
): Core {
  switch (insertion["@kind"]) {
    case "InsertionPatternVar": {
      const argValue = solutionLookupValue(
        mod.solution,
        insertion.patternVar.neutral.name,
      )

      if (argValue === undefined) {
        if (insertion.argExp !== undefined) {
          throw new Errors.ElaborationError(
            [
              `[insertionApply] meet unsolved pattern variable during infer`,
              `  variable name: ${insertion.patternVar.neutral.name}`,
              `  kind of next arg exp: ${insertion.argExp["@kind"]}`,
            ].join("\n"),
            { span: insertion.argExp.span },
          )
        } else {
          throw new Errors.ElaborationError(
            [
              `[insertionApply] meet unsolved pattern variable during check`,
              `  variable name: ${insertion.patternVar.neutral.name}`,
            ].join("\n"),
            {},
          )
        }
      }

      const argCore = readback(mod, ctx, insertion.patternVar.type, argValue)
      return Cores.ApImplicit(core, argCore)
    }

    case "InsertionUsedArg": {
      return Cores.Ap(core, insertion.argCore)
    }

    case "InsertionImplicitArg": {
      return Cores.ApImplicit(core, insertion.argCore)
    }
  }
}
