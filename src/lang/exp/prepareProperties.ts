import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { Exp, infer } from "../exp"
import * as Values from "../value"

export function prepareProperties(
  ctx: Ctx,
  properties: Array<Exps.Property>,
): Record<string, Exp> {
  const found: Set<string> = new Set()
  const record: Record<string, Exp> = {}

  for (const property of properties) {
    switch (property.kind) {
      case "PropertyPlain": {
        if (found.has(property.name)) {
          throw new ElaborationError(`duplicate properties: ${property.name}`)
        }

        record[property.name] = property.exp
        found.add(property.name)
        continue
      }

      case "PropertySpread": {
        /**
           Type directed spread
        **/
        const inferred = infer(ctx, property.exp)
        Values.assertClazzInCtx(ctx, inferred.type)
        for (const name of Values.clazzPropertyNames(inferred.type)) {
          if (found.has(name)) {
            throw new ElaborationError(
              `duplicate properties in spread: ${name}`,
            )
          }

          record[name] = Exps.Dot(property.exp, name)
          found.add(name)
          continue
        }
      }
    }
  }

  return record
}
