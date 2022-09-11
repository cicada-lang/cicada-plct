import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"

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
      }

      case "PropertySpread": {
        // TODO
      }
    }
  }

  return record
}
