import * as Cores from "../core"
import { evaluate } from "../core"
import { Ctx, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { checkProperties, Exp, infer, Inferred } from "../exp"
import * as Values from "../value"
import { assertClazzInCtx, inclusion, Value } from "../value"

/**

   # enrich

   Check the `exp` is of given `type`,
   and return a more specific type
   which might be a subtype of `type`.

**/

export function enrich(ctx: Ctx, exp: Exp, type: Value): Inferred {
  try {
    const inferred = infer(ctx, exp)
    inclusion(ctx, inferred.type, type)
    return inferred
  } catch (_error) {
    return enrichWithoutInfer(ctx, exp, type)
  }
}

function enrichWithoutInfer(ctx: Ctx, exp: Exp, type: Value): Inferred {
  switch (exp.kind) {
    case "FoldedObjekt": {
      return enrich(
        ctx,
        Exps.Objekt(Exps.prepareProperties(ctx, exp.properties)),
        type,
      )
    }

    case "Objekt": {
      assertClazzInCtx(ctx, type)

      const properties = checkProperties(ctx, exp.properties, type)

      /**
         Extra properties are not checked,
         thus we require that they are infer-able.
      **/

      const names = Object.keys(properties)
      const extraInferred = Object.entries(exp.properties)
        .filter(([name, exp]) => !names.includes(name))
        .map(([name, exp]): [string, Exps.Inferred] => [name, infer(ctx, exp)])
      const extraProperties = Object.fromEntries(
        extraInferred.map(([name, inferred]) => [name, inferred.core]),
      )

      const extraTypedValues = Object.fromEntries(
        extraInferred.map(([name, inferred]) => [
          name,
          {
            type: inferred.type,
            value: evaluate(ctxToEnv(ctx), inferred.core),
          },
        ]),
      )

      const extraClazz = Values.clazzFromTypedValues(extraTypedValues)

      return Inferred(
        Values.prependFulfilledClazz(extraClazz, type),
        Cores.Objekt({ ...properties, ...extraProperties }),
      )
    }

    default: {
      throw new ElaborationError(
        `enrichWithoutInfer is not implemented for: ${exp.kind}`,
      )
    }
  }
}
