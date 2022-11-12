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
        throw new Errors.ElaborationError(
          [
            `[insertDuringInfer applyInsertion] unsolved pattern variable`,
            `  variable name: ${insertion.patternVar.neutral.name}`,
          ].join("\n"),
          // TODO Span
          { span: undefined },
        )
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
