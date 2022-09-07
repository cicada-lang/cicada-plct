import * as Cores from "../core"
import { AlphaCtx, alphaEquivalent } from "../core"
import { ElaborationError } from "../errors"

/**

   The alpha equivalent between two clazzes is defined as
   step by step equivalent after reorder the right by the left.

**/

export function alphaEquivalentClazz(
  ctx: AlphaCtx,
  left: Cores.Clazz,
  right: Cores.Clazz,
): void {
  alphaEquivalentClazzAfterReorder(
    ctx,
    left,
    reorderTheRightByTheLeft(left, right),
  )
}

function alphaEquivalentClazzAfterReorder(
  ctx: AlphaCtx,
  left: Cores.Clazz,
  right: Cores.Clazz,
): void {
  /**
     The property names are checked during reorder,
     we should use the `localName` now.
  **/

  if (left.kind === "ClazzNull" && right.kind === "ClazzNull") {
    return
  }

  if (left.kind === "ClazzCons" && right.kind === "ClazzCons") {
    alphaEquivalent(ctx, left.propertyType, right.propertyType)
    ctx = ctx.cons(left.localName, right.localName)
    alphaEquivalentClazzAfterReorder(ctx, left.rest, right.rest)
    return
  }

  if (left.kind === "ClazzFulfilled" && right.kind === "ClazzFulfilled") {
    alphaEquivalent(ctx, left.propertyType, right.propertyType)
    alphaEquivalent(ctx, left.property, right.property)
    alphaEquivalentClazzAfterReorder(ctx, left.rest, right.rest)
    return
  }

  throw new ElaborationError(`alphaEquivalentClazz fail`)
}

function reorderTheRightByTheLeft(
  left: Cores.Clazz,
  right: Cores.Clazz,
  reordered: Cores.Clazz = Cores.ClazzNull(),
): Cores.Clazz {
  switch (left.kind) {
    case "ClazzNull": {
      if (right.kind === "ClazzNull") {
        return reordered
      }

      throw new ElaborationError(`extract properties on the right clazz`)
    }

    case "ClazzCons": {
      return reorderTheRightByTheLeft(
        left.rest,
        remove(left.name, right),
        append(reordered, find(left.name, right)),
      )
    }

    case "ClazzFulfilled": {
      return reorderTheRightByTheLeft(
        left.rest,
        remove(left.name, right),
        append(reordered, find(left.name, right)),
      )
    }
  }
}

function remove(name: string, clazz: Cores.Clazz): Cores.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      return clazz
    }

    case "ClazzCons": {
      if (clazz.name === name) {
        return clazz.rest
      }

      return Cores.ClazzCons(
        clazz.name,
        clazz.localName,
        clazz.propertyType,
        remove(name, clazz.rest),
      )
    }

    case "ClazzFulfilled": {
      if (clazz.name === name) {
        return clazz.rest
      }

      return Cores.ClazzFulfilled(
        clazz.name,
        clazz.propertyType,
        clazz.property,
        remove(name, clazz.rest),
      )
    }
  }
}

function find(name: string, clazz: Cores.Clazz): Cores.Clazz {
  switch (clazz.kind) {
    case "ClazzNull": {
      throw new ElaborationError(`expect to find ${name} in clazz`)
    }

    case "ClazzCons": {
      if (clazz.name === name) {
        return Cores.ClazzCons(
          clazz.name,
          clazz.localName,
          clazz.propertyType,
          Cores.ClazzNull(),
        )
      }

      return find(name, clazz.rest)
    }

    case "ClazzFulfilled": {
      if (clazz.name === name) {
        return Cores.ClazzFulfilled(
          clazz.name,
          clazz.propertyType,
          clazz.property,
          Cores.ClazzNull(),
        )
      }

      return find(name, clazz.rest)
    }
  }
}

function append(left: Cores.Clazz, right: Cores.Clazz): Cores.Clazz {
  switch (left.kind) {
    case "ClazzNull": {
      return right
    }

    case "ClazzCons": {
      return Cores.ClazzCons(
        left.name,
        left.localName,
        left.propertyType,
        append(left.rest, right),
      )
    }

    case "ClazzFulfilled": {
      return Cores.ClazzFulfilled(
        left.name,
        left.propertyType,
        left.property,
        append(left.rest, right),
      )
    }
  }
}
