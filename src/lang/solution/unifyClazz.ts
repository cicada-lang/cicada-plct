import { Ctx, ctxNames } from "../ctx"
import * as Errors from "../errors"
import { Mod } from "../mod"
import { unify, unifyType } from "../solution"
import { freshenNames } from "../utils/freshen"
import * as Values from "../value"
import { expelClazz, Value } from "../value"

/**

   Just like in `inclusionClazz`,
   the order does not matters for unification,

**/

export function unifyClazz(
  mod: Mod,
  ctx: Ctx,
  left: Values.Clazz,
  right: Values.Clazz,
): void {
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

    unifyClazzProperty(mod, ctx, freshName, leftProperty, rightProperty)
  }
}

function unifyClazzProperty(
  mod: Mod,
  ctx: Ctx,
  freshName: string,
  left: { type: Value; value?: Value },
  right: { type: Value; value?: Value },
): void {
  unifyType(mod, ctx, left.type, right.type)

  if (left.value !== undefined && right.value !== undefined) {
    unify(mod, ctx, left.type, left.value, right.value)
  }

  if (left.value !== undefined && right.value === undefined) {
    const patternVar = mod.solution.createPatternVar(freshName, left.type)
    unify(mod, ctx, left.type, left.value, patternVar)
  }

  if (left.value === undefined && right.value !== undefined) {
    const patternVar = mod.solution.createPatternVar(freshName, right.type)
    unify(mod, ctx, right.type, patternVar, right.value)
  }
}
