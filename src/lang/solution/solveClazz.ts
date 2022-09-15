import { Ctx, ctxNames } from "../ctx"
import { Solution, solve } from "../solution"
import { freshenNames } from "../utils/freshen"
import * as Values from "../value"
import { expelClazz } from "../value"

/**

   Just like in `inclusionClazz`,
   the order does not matters for unification,

**/

export function solveClazz(
  solution: Solution,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): Solution {
  const freshNameMap = freshenNames(
    new Set([...ctxNames(ctx)]),
    new Set([
      ...Values.clazzPropertyNames(left),
      ...Values.clazzPropertyNames(right),
    ]),
  )

  const leftPropertyMap = expelClazz(freshNameMap, left)
  const rightPropertyMap = expelClazz(freshNameMap, right)

  for (const [name, rightProperty] of rightPropertyMap.entries()) {
    const leftProperty = leftPropertyMap.get(name)
    if (leftProperty === undefined) continue

    solution = solve(
      solution,
      ctx,
      Values.Type(),
      leftProperty.type,
      rightProperty.type,
    )

    if (leftProperty.value !== undefined && rightProperty.value !== undefined) {
      solution = solve(
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
