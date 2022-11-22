import * as Cores from "../core"
import { AlphaCtx, alphaEquivalent } from "../equivalent"
import * as Errors from "../errors"

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

  if (left["@kind"] === "ClazzNull" && right["@kind"] === "ClazzNull") {
    return
  }

  if (left["@kind"] === "ClazzCons" && right["@kind"] === "ClazzCons") {
    alphaEquivalent(ctx, left.propertyType, right.propertyType)
    ctx = ctx.cons(left.localName, right.localName)
    alphaEquivalentClazzAfterReorder(ctx, left.rest, right.rest)
    return
  }

  if (
    left["@kind"] === "ClazzFulfilled" &&
    right["@kind"] === "ClazzFulfilled"
  ) {
    alphaEquivalent(ctx, left.propertyType, right.propertyType)
    alphaEquivalent(ctx, left.property, right.property)
    alphaEquivalentClazzAfterReorder(ctx, left.rest, right.rest)
    return
  }

  throw new Errors.EquivalenceError(`[alphaEquivalentClazz] fail`)
}

function reorderTheRightByTheLeft(
  left: Cores.Clazz,
  right: Cores.Clazz,
  reordered: Cores.Clazz = Cores.ClazzNull(),
): Cores.Clazz {
  switch (left["@kind"]) {
    case "ClazzNull": {
      if (right["@kind"] === "ClazzNull") {
        return reordered
      }

      throw new Errors.EquivalenceError(
        `[reorderTheRightByTheLeft] expect properties on the right clazz`,
      )
    }

    case "ClazzCons": {
      return reorderTheRightByTheLeft(
        left.rest,
        deleteProperty(left.propertyName, right),
        Cores.clazzAppend(
          reordered,
          findPropertyAndCreateClazz(left.propertyName, right),
        ),
      )
    }

    case "ClazzFulfilled": {
      return reorderTheRightByTheLeft(
        left.rest,
        deleteProperty(left.propertyName, right),
        Cores.clazzAppend(
          reordered,
          findPropertyAndCreateClazz(left.propertyName, right),
        ),
      )
    }
  }
}

function deleteProperty(name: string, clazz: Cores.Clazz): Cores.Clazz {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      return clazz
    }

    case "ClazzCons": {
      if (clazz.propertyName === name) {
        return clazz.rest
      }

      return Cores.ClazzCons(
        clazz.propertyName,
        clazz.localName,
        clazz.propertyType,
        deleteProperty(name, clazz.rest),
      )
    }

    case "ClazzFulfilled": {
      if (clazz.propertyName === name) {
        return clazz.rest
      }

      return Cores.ClazzFulfilled(
        clazz.propertyName,
        clazz.propertyType,
        clazz.property,
        deleteProperty(name, clazz.rest),
      )
    }
  }
}

function findPropertyAndCreateClazz(
  name: string,
  clazz: Cores.Clazz,
): Cores.Clazz {
  switch (clazz["@kind"]) {
    case "ClazzNull": {
      throw new Errors.EquivalenceError(
        `[findPropertyAndCreateClazz] expect to find ${name} in clazz`,
      )
    }

    case "ClazzCons": {
      if (clazz.propertyName === name) {
        return Cores.ClazzCons(
          clazz.propertyName,
          clazz.localName,
          clazz.propertyType,
          Cores.ClazzNull(),
        )
      }

      return findPropertyAndCreateClazz(name, clazz.rest)
    }

    case "ClazzFulfilled": {
      if (clazz.propertyName === name) {
        return Cores.ClazzFulfilled(
          clazz.propertyName,
          clazz.propertyType,
          clazz.property,
          Cores.ClazzNull(),
        )
      }

      return findPropertyAndCreateClazz(name, clazz.rest)
    }
  }
}
