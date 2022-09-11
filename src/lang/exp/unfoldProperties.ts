import * as Exps from "../exp"
import { Exp } from "../exp"

export function unfoldProperties(
  properties: Array<Exps.Property>,
): Record<string, Exp> {
  return Object.fromEntries(
    properties.map((property) => [property.name, property.exp]),
  )
}
