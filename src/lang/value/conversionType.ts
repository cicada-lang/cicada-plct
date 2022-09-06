import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import { conversionNeutral } from "../neutral"
import * as Values from "../value"
import { applyClosure, conversionClazz, Value } from "../value"

export function conversionType(ctx: Ctx, left: Value, right: Value): void {
  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    /**
       The `left.type` and `right.type` are ignored here,
       maybe we should use them to debug.
      **/

    conversionNeutral(ctx, left.neutral, right.neutral)
    return
  }

  if (left.kind === "Type" && right.kind === "Type") {
    return
  }

  if (left.kind === "Trivial" && right.kind === "Trivial") {
    return
  }

  if (left.kind === "String" && right.kind === "String") {
    return
  }

  if (left.kind === "Pi" && right.kind === "Pi") {
    conversionType(ctx, left.argType, right.argType)
    const name = left.retTypeClosure.name
    const argType = left.argType

    const freshName = freshenInCtx(ctx, name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(argType, variable)

    ctx = CtxCons(freshName, argType, ctx)

    conversionType(
      ctx,
      applyClosure(left.retTypeClosure, typedNeutral),
      applyClosure(right.retTypeClosure, typedNeutral),
    )

    return
  }

  if (left.kind === "Sigma" && right.kind === "Sigma") {
    conversionType(ctx, left.carType, right.carType)
    const name = left.cdrTypeClosure.name
    const carType = left.carType

    const freshName = freshenInCtx(ctx, name)
    const variable = Neutrals.Var(freshName)
    const typedNeutral = Values.TypedNeutral(carType, variable)

    ctx = CtxCons(freshName, carType, ctx)

    conversionType(
      ctx,
      applyClosure(left.cdrTypeClosure, typedNeutral),
      applyClosure(right.cdrTypeClosure, typedNeutral),
    )

    return
  }

  if (Values.isClazz(left) && Values.isClazz(right)) {
    conversionClazz(ctx, left, right)
    return
  }

  throw new ElaborationError(
    `conversionType is not implemented for left: ${left.kind} and right: ${right.kind}`,
  )
}
