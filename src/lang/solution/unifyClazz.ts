import { Ctx, ctxNames } from "../ctx"
import { Solution, unify, unifyType } from "../solution"
import { freshenNames } from "../utils/freshen"
import * as Values from "../value"
import { expelClazz } from "../value"

/**

   Just like in `inclusionClazz`,
   the order does not matters for unification,

**/

export function unifyClazz(
  solution: Solution,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): Solution {
  const freshNameMap = freshenNames(
    [...ctxNames(ctx), ...solution.names],
    [...Values.clazzPropertyNames(left), ...Values.clazzPropertyNames(right)],
  )

  const leftPropertyMap = expelClazz(freshNameMap, left)
  const rightPropertyMap = expelClazz(freshNameMap, right)

  for (const [name, rightProperty] of rightPropertyMap.entries()) {
    const leftProperty = leftPropertyMap.get(name)
    if (leftProperty === undefined) continue

    unifyType(solution, ctx, leftProperty.type, rightProperty.type)

    if (leftProperty.value !== undefined && rightProperty.value !== undefined) {
      unify(
        solution,
        ctx,
        leftProperty.type,
        leftProperty.value,
        rightProperty.value,
      )
    }
  }

  return solution
}
