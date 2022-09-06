import { Ctx, CtxCons, freshenInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { applyClosure, Value } from "../value"

export function conversionType(ctx: Ctx, left: Value, right: Value): void {
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

  if (left.kind === "ClazzCons" && right.kind === "ClazzCons") {
    // TODO handle ClazzCons
    return
  }

  if (left.kind === "TypedNeutral" && right.kind === "TypedNeutral") {
    if (left.neutral.kind === "Var" && right.neutral.kind === "Var") {
      if (left.neutral.name === right.neutral.name) {
        return
      } else {
        throw new ElaborationError(
          `expect variable: ${left.neutral.name} to be equal to variable: ${right.neutral.name}`,
        )
      }
    }

    // TODO handle other neutral cases.
  }

  throw new ElaborationError(
    `conversionType is not implemented for left: ${left.kind} and right: ${right.kind}`,
  )
}
