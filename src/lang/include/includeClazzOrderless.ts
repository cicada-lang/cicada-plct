import { Ctx, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { include } from "../include"
import { Mod } from "../mod"
import { unify } from "../unify"
import { freshenNames } from "../utils/freshen"
import * as Values from "../value"
import { clazzExpel, Value } from "../value"

/**

   To compare `Clazz`es out of order,
   all we need is to prepare the `freshNames` first,
   because for example, in the case of `Sigma` in `equivalentType`,
   all we need is to make sure that the `freshName` are the same
   when building the `TypedNeutral`.

   Then `clazzExpel` use the `freshName`
   to expel all types and values from `Values.Clazz`,
   it returns a `PropertyMap`, so that the order does not matters anymore.

**/

export function includeClazzOrderless(
  mod: Mod,
  ctx: Ctx,
  clazz: Values.Clazz,
  subclazz: Values.Clazz,
): void {
  const freshNameMap = freshenNames(
    [...ctxNames(ctx), ...mod.solution.names],
    [
      ...Values.clazzPropertyNames(subclazz),
      ...Values.clazzPropertyNames(clazz),
    ],
  )

  const subclazzPropertyMap = clazzExpel(freshNameMap, subclazz)
  const clazzPropertyMap = clazzExpel(freshNameMap, clazz)

  for (const [name, clazzProperty] of clazzPropertyMap.entries()) {
    const subclazzProperty = subclazzPropertyMap.get(name)
    if (subclazzProperty === undefined) {
      throw new Errors.InclusionError(
        `[includeClazzOrderless] expect subclass to have property: ${name}`,
      )
    }

    const freshName = freshNameMap.get(name)
    if (freshName === undefined) {
      throw new Errors.InternalError(
        `[includeClazzOrderless] expect ${name} to be found in freshNameMap`,
      )
    }

    try {
      includeClazzProperty(
        mod,
        ctx,
        name,
        freshName,
        clazzProperty,
        subclazzProperty,
      )
    } catch (error) {
      if (error instanceof Errors.InclusionError) {
        error.trace.unshift(
          [`[includeClazzOrderless] property: ${name}`].join("\n"),
        )
      }

      throw error
    }
  }
}

function includeClazzProperty(
  mod: Mod,
  ctx: Ctx,
  name: string,
  freshName: string,
  clazzProperty: { type: Value; value?: Value },
  subclazzProperty: { type: Value; value?: Value },
): void {
  if (
    subclazzProperty.value === undefined &&
    clazzProperty.value !== undefined
  ) {
    throw new Errors.InclusionError(
      [
        `[includeClazzOrderless includeClazzProperty] expect subclass to have fulfilled property value`,
        `  property name: ${name}`,
      ].join("\n"),
    )
  }

  include(mod, ctx, clazzProperty.type, subclazzProperty.type)

  if (
    subclazzProperty.value !== undefined &&
    clazzProperty.value !== undefined
  ) {
    unify(
      mod,
      ctx,
      clazzProperty.type,
      clazzProperty.value,
      subclazzProperty.value,
    )
  }

  if (
    subclazzProperty.value !== undefined &&
    clazzProperty.value === undefined
  ) {
    unify(
      mod,
      ctx,
      clazzProperty.type,
      mod.solution.createPatternVar(freshName, subclazzProperty.type),
      subclazzProperty.value,
    )
  }
}
