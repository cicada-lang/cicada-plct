import type { Ctx } from "../ctx/index.js"
import * as Errors from "../errors/index.js"
import type { Exp } from "../exp/index.js"
import * as Exps from "../exp/index.js"
import { infer } from "../infer/index.js"
import type { Mod } from "../mod/index.js"
import * as Values from "../value/index.js"

export function prepareProperties(
  mod: Mod,
  ctx: Ctx,
  properties: Array<Exps.Property>,
): Record<string, Exp> {
  const found: Set<string> = new Set()
  const record: Record<string, Exp> = {}

  for (const property of properties) {
    for (const [name, exp] of prepareProperty(mod, ctx, property)) {
      if (found.has(name)) {
        throw new Errors.ElaborationError(`duplicate properties: ${name}`, {})
      }

      record[name] = exp
      found.add(name)
    }
  }

  return record
}

function prepareProperty(
  mod: Mod,
  ctx: Ctx,
  property: Exps.Property,
): Array<[string, Exp]> {
  switch (property["@kind"]) {
    case "PropertyPlain": {
      return [[property.name, property.exp]]
    }

    case "PropertySpread": {
      /**
         Type directed spread
      **/
      const inferred = infer(mod, ctx, property.exp)
      Values.assertClazzInCtx(mod, ctx, inferred.type)
      const names = Values.clazzPropertyNames(inferred.type)
      return names.map((name) => [name, Exps.Dot(property.exp, name)])
    }
  }
}
