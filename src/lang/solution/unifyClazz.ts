import { Ctx, ctxNames } from "../ctx" //
import * as Errors from "../errors"
import { Mod } from "../mod"
import { Solution, unify, unifyType } from "../solution"
import { freshenNames } from "../utils/freshen"
import * as Values from "../value"
import { expelClazz } from "../value"

/**

   Just like in `inclusionClazz`,
   the order does not matters for unification,

**/

export function unifyClazz(
  mod: Mod,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): Solution {
  const freshNameMap = freshenNames(
    [...ctxNames(ctx), ...mod.solution.names],
    [...Values.clazzPropertyNames(left), ...Values.clazzPropertyNames(right)],
  )

  const leftPropertyMap = expelClazz(freshNameMap, left)
  const rightPropertyMap = expelClazz(freshNameMap, right)

  for (const [name, rightProperty] of rightPropertyMap.entries()) {
    const leftProperty = leftPropertyMap.get(name)
    if (leftProperty === undefined) continue

    const freshName = freshNameMap.get(name)
    if (freshName === undefined) {
      throw new Errors.InternalError(
        `unifyClazz expect ${name} to be found in freshNameMap`,
      )
    }

    unifyType(mod, ctx, leftProperty.type, rightProperty.type)

    if (leftProperty.value !== undefined && rightProperty.value !== undefined) {
      unify(
        mod,
        ctx,
        leftProperty.type,
        leftProperty.value,
        rightProperty.value,
      )
    }

    if (leftProperty.value !== undefined) {
      unify(
        mod,
        ctx,
        leftProperty.type,
        leftProperty.value,
        mod.solution.createPatternVar(freshName, rightProperty.type),
      )
    }

    if (rightProperty.value !== undefined) {
      unify(
        mod,
        ctx,
        rightProperty.type,
        mod.solution.createPatternVar(freshName, leftProperty.type),
        rightProperty.value,
      )
    }
  }

  return mod.solution
}
