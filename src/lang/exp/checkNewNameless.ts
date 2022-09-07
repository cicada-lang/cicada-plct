import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check } from "../exp"
import * as Values from "../value"
import { assertClazzInCtx, readback } from "../value"

export function checkNewNameless(
  ctx: Ctx,
  body: Exps.NewNamelessBody,
  clazz: Values.Clazz,
): Record<string, Core> {
  switch (clazz.kind) {
    case "ClazzNull": {
      if (body.kind === "NewNamelessNull") {
        return {}
      } else {
        throw new ElaborationError(`extra property in NewNameless`)
      }
    }

    case "ClazzCons": {
      if (body.kind === "NewNamelessNull") {
        throw new ElaborationError(`missing property in NewNameless`)
      } else {
        const core = check(ctx, body.property, clazz.propertyType)
        const value = evaluate(ctxToEnv(ctx), core)
        const rest = Values.applyClosure(clazz.restClosure, value)
        assertClazzInCtx(ctx, rest)
        ctx = CtxCons(clazz.name, clazz.propertyType, ctx)
        return {
          [clazz.name]: core,
          ...checkNewNameless(ctx, body.rest, rest),
        }
      }
    }

    case "ClazzFulfilled": {
      const value = clazz.property
      const core = readback(ctx, clazz.propertyType, value)

      return {
        [clazz.name]: core,
        ...checkNewNameless(ctx, body, clazz.rest),
      }
    }
  }
}
