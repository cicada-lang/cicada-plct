import * as Cores from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { checkProperties, Exp, infer, Inferred } from "../exp"
import { Solution } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

/**

   # enrich

   Check the `exp` is of given `type`,
   and return a more specific type
   which might be a subtype of `type`.

**/

export function enrich(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
  type: Value,
): Inferred {
  try {
    const inferred = infer(solution, ctx, exp)
    Values.inclusion(ctx, inferred.type, type)
    return inferred
  } catch (_error) {
    return enrichWithoutInfer(solution, ctx, exp, type)
  }
}

function enrichWithoutInfer(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
  type: Value,
): Inferred {
  switch (exp.kind) {
    case "FoldedObjekt": {
      return enrich(
        solution,
        ctx,
        Exps.Objekt(Exps.prepareProperties(solution, ctx, exp.properties)),
        type,
      )
    }

    case "Objekt": {
      Values.assertClazzInCtx(ctx, type)

      const properties = checkProperties(solution, ctx, exp.properties, type)
      const names = Object.keys(properties)

      /**
         Extra properties are not checked,
         thus we require that they are infer-able.
      **/

      const extra = Exps.inferExtraProperties(
        solution,
        ctx,
        exp.properties,
        names,
      )

      return Inferred(
        Values.prependFulfilledClazz(extra.clazz, type),
        Cores.Objekt({ ...properties, ...extra.properties }),
      )
    }

    default: {
      throw new ElaborationError(
        `enrichWithoutInfer is not implemented for: ${exp.kind}`,
      )
    }
  }
}
