import { indent } from "../../utils/indent.js"
import { closureApply } from "../closure/index.js"
import type { Ctx } from "../ctx/index.js"
import { CtxCons, ctxNames } from "../ctx/index.js"
import {
  equivalent,
  equivalentClazz,
  equivalentNeutral,
} from "../equivalent/index.js"
import * as Errors from "../errors/index.js"
import type { Mod } from "../mod/index.js"
import * as Neutrals from "../neutral/index.js"
import { solutionAdvanceValue, solutionNames } from "../solution/index.js"
import { freshen } from "../utils/freshen.js"
import * as Values from "../value/index.js"
import { type Value, formatType, isClazz } from "../value/index.js"

export function equivalentType(
  mod: Mod,
  ctx: Ctx,
  left: Value,
  right: Value,
): void {
  left = solutionAdvanceValue(mod, left)
  right = solutionAdvanceValue(mod, right)

  try {
    equivalentTypeAux(mod, ctx, left, right)
  } catch (error) {
    if (error instanceof Errors.EquivalenceError) {
      error.trace.unshift(
        [
          `[equivalentType]`,
          indent(`left: ${formatType(mod, ctx, left)}`),
          indent(`right: ${formatType(mod, ctx, right)}`),
        ].join("\n"),
      )
    }

    throw error
  }
}

function equivalentTypeAux(
  mod: Mod,
  ctx: Ctx,
  left: Value,
  right: Value,
): void {
  if (left["@kind"] === "TypedNeutral" && right["@kind"] === "TypedNeutral") {
    /**
       The `type` in `TypedNeutral` are not used.
    **/

    equivalentNeutral(mod, ctx, left.type, left.neutral, right.neutral)
    return
  }

  if (left["@kind"] === "Type" && right["@kind"] === "Type") {
    return
  }

  if (left["@kind"] === "String" && right["@kind"] === "String") {
    return
  }

  if (left["@kind"] === "Trivial" && right["@kind"] === "Trivial") {
    return
  }

  if (
    (left["@kind"] === "Pi" && right["@kind"] === "Pi") ||
    (left["@kind"] === "PiImplicit" && right["@kind"] === "PiImplicit")
  ) {
    equivalentType(mod, ctx, left.argType, right.argType)
    const name = right.retTypeClosure.name
    const argType = right.argType
    const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(argType, Neutrals.Var(freshName))
    ctx = CtxCons(freshName, argType, ctx)
    const leftRet = closureApply(left.retTypeClosure, v)
    const rightRet = closureApply(right.retTypeClosure, v)
    equivalentType(mod, ctx, leftRet, rightRet)
    return
  }

  if (left["@kind"] === "Sigma" && right["@kind"] === "Sigma") {
    equivalentType(mod, ctx, left.carType, right.carType)
    const name = right.cdrTypeClosure.name
    const carType = right.carType
    const usedNames = [...ctxNames(ctx), ...solutionNames(mod.solution)]
    const freshName = freshen(usedNames, name)
    const v = Values.TypedNeutral(carType, Neutrals.Var(freshName))
    ctx = CtxCons(freshName, carType, ctx)
    const leftRet = closureApply(left.cdrTypeClosure, v)
    const rightRet = closureApply(right.cdrTypeClosure, v)
    equivalentType(mod, ctx, leftRet, rightRet)
    return
  }

  if (isClazz(left) && isClazz(right)) {
    equivalentClazz(mod, ctx, left, right)
    return
  }

  if (left["@kind"] === "Equal" && right["@kind"] === "Equal") {
    equivalentType(mod, ctx, left.type, right.type)
    const equalType = left.type
    equivalent(mod, ctx, equalType, left.from, right.from)
    equivalent(mod, ctx, equalType, left.to, right.to)
    return
  }

  throw new Errors.EquivalenceError(
    [
      `[equivalentType] is not implemented for the pair of type values`,
      indent(`left: ${formatType(mod, ctx, left)}`),
      indent(`right: ${formatType(mod, ctx, right)}`),
    ].join("\n"),
  )
}
