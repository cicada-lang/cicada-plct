import { Ctx, ctxNames } from "../ctx"
import { ElaborationError } from "../errors"
import { freshenNames } from "../utils/freshen"
import * as Values from "../value"
import { conversion, expelClazz, inclusion } from "../value"

/**

   # Comparing out of order Clazzes

   All properties in `clazz` must also occurs in `subclazz`.

   To compare out of order `Clazz`es,
   all we need is to prepare the `freshNames` first,
   because for example, in the case of `Sigma` in `conversionType`,
   all we need is to make sure that the `freshName` are the same
   when building the `TypedNeutral`.

   Then `expelClazz` use the `freshName`
   to expel all types and values from `Values.Clazz`,
   it returns a `PropertyMap`, so that the order does not matters anymore.

**/

export function inclusionClazz(
  ctx: Ctx,
  subclazz: Values.Clazz,
  clazz: Values.Clazz,
): void {
  const freshNameMap = freshenNames(
    new Set([...ctxNames(ctx)]),
    new Set([
      ...Values.clazzPropertyNames(subclazz),
      ...Values.clazzPropertyNames(clazz),
    ]),
  )

  const subclazzPropertyMap = expelClazz(freshNameMap, subclazz)
  const clazzPropertyMap = expelClazz(freshNameMap, clazz)

  for (const [name, clazzProperty] of clazzPropertyMap.entries()) {
    const subclazzProperty = subclazzPropertyMap.get(name)
    if (subclazzProperty === undefined) {
      throw new ElaborationError(
        `inclusionClazz found missing property on subclazz class: ${name}`,
      )
    }

    if (
      subclazzProperty.value === undefined &&
      clazzProperty.value !== undefined
    ) {
      throw new ElaborationError(
        `inclusionClazz expect subproperty to have fulfilled property: ${name}`,
      )
    }

    inclusion(ctx, subclazzProperty.type, clazzProperty.type)

    if (
      subclazzProperty.value !== undefined &&
      clazzProperty.value !== undefined
    ) {
      conversion(
        ctx,
        clazzProperty.type,
        subclazzProperty.value,
        clazzProperty.value,
      )
    }
  }
}
