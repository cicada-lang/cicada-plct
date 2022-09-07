import * as Cores from "../core"
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
  } else if (isClazz(left) && isClazz(right)) {
    alphaEquivalentClazz(ctx, left, right)
  } else if (left.kind === "Objekt" && right.kind === "Objekt") {
    alphaEquivalentProperties(ctx, left.properties, right.properties)
  } else if (left.kind === "Dot" && right.kind === "Dot") {
    if (left.name !== right.name) {
      throw new ElaborationError(
        `alphaEquivalent expect left name: ${left.name} to be equal to right name: ${right.name}`,
      )
    }

    alphaEquivalent(ctx, left.target, right.target)
  } else {
    throw new ElaborationError(
      `alphaEquivalent is not implemented for left: ${formatCore(
        left,
      )}, and right: ${formatCore(right)}`,
    )
  }
}

function isClazz(core: Core): core is Cores.Clazz {
  return ["ClazzNull", "ClazzCons", "ClazzFulfilled"].includes(core.kind)
}

function alphaEquivalentProperties(
  ctx: AlphaCtx,
  leftProperties: Record<string, Core>,
  rightProperties: Record<string, Core>,
): void {
  const leftSize = Object.keys(leftProperties).length
  const rightSize = Object.keys(rightProperties).length

  if (leftSize !== rightSize) {
    throw new ElaborationError(
      `alphaEquivalentProperties expect the left size: ${leftSize} to be equal to the right size: ${rightSize}`,
    )
  }

  for (const [name, left] of Object.entries(leftProperties)) {
    const right = rightProperties[name]
    if (right === undefined) {
      throw new ElaborationError(
        `alphaEquivalentProperties missing property: ${name} on the right side`,
      )
    }

    alphaEquivalent(ctx, left, right)
  }
}

// NOTE Handle out of order properties.
function alphaEquivalentClazz(
  ctx: AlphaCtx,
  left: Cores.Clazz,
  right: Cores.Clazz,
): void {
  // TODO
}
