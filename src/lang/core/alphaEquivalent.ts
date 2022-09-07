import { AlphaCtx, Core, formatCore } from "../core"
import { ElaborationError } from "../errors"

export function alphaEquivalent(ctx: AlphaCtx, left: Core, right: Core): void {
  if (left.kind === "Var" && right.kind === "Var") {
    ctx.assertEqualNames(left.name, right.name)
  } else if (left.kind === "Pi" && right.kind === "Pi") {
    alphaEquivalent(ctx, left.argType, right.argType)
    alphaEquivalent(
      ctx.cons(left.name, right.name),
      left.retType,
      right.retType,
    )
  } else if (left.kind === "Fn" && right.kind === "Fn") {
    alphaEquivalent(ctx.cons(left.name, right.name), left.ret, right.ret)
  } else if (left.kind === "Ap" && right.kind === "Ap") {
    alphaEquivalent(ctx, left.target, right.target)
    alphaEquivalent(ctx, left.arg, right.arg)
  } else if (left.kind === "Sigma" && right.kind === "Sigma") {
    alphaEquivalent(ctx, left.carType, right.carType)
    alphaEquivalent(
      ctx.cons(left.name, right.name),
      left.cdrType,
      right.cdrType,
    )
  } else if (left.kind === "Car" && right.kind === "Car") {
    alphaEquivalent(ctx, left.target, right.target)
  } else if (left.kind === "Cdr" && right.kind === "Cdr") {
    alphaEquivalent(ctx, left.target, right.target)
  } else if (left.kind === "Quote" && right.kind === "Quote") {
    if (left.literal !== right.literal) {
      throw new ElaborationError(
        `alphaEquivalent expect left literal: ${left.literal} to be equal to right literal: ${right.literal}`,
      )
    }
    // } else if (left.kind === "Clazz" && right.kind === "Clazz") {
    //   // TODO
  } else if (left.kind === "Objekt" && right.kind === "Objekt") {
    // TODO
  } else if (left.kind === "Dot" && right.kind === "Dot") {
    alphaEquivalent(ctx, left.target, right.target)
    if (left.name !== right.name) {
      throw new ElaborationError(
        `alphaEquivalent expect left name: ${left.name} to be equal to right name: ${right.name}`,
      )
    }
  } else {
    throw new ElaborationError(
      `alphaEquivalent is not implemented for left: ${formatCore(
        left,
      )}, and right: ${formatCore(right)}`,
    )
  }
}
