import * as Cores from "../core"
import { Core } from "../core"
import { Ctx } from "../ctx"
import * as Errors from "../errors"
import { Insertion } from "../insert"
import { Mod } from "../mod"
import { readback } from "../readback"

export function applyInsertion(
  mod: Mod,
  ctx: Ctx,
  insertion: Insertion,
  core: Core,
): Core {
  switch (insertion.kind) {
    case "InsertionPatternVar": {
      const argValue = mod.solution.lookupValue(
        insertion.patternVar.neutral.name,
      )

      if (argValue === undefined) {
        if (insertion.argExp !== undefined) {
          throw new Errors.ElaborationError(
            [
              `[applyInsertion] meet unsolved pattern variable during infer`,
              `  variable name: ${insertion.patternVar.neutral.name}`,
              `  kind of next arg exp: ${insertion.argExp.kind}`,
            ].join("\n"),
            { span: insertion.argExp.span },
          )
        } else {
          throw new Errors.ElaborationError(
            [
              `[applyInsertion] meet unsolved pattern variable during check`,
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
