import * as Exps from "./Exp"
import { Exp } from "./Exp"

export function unfoldProperties(
  properties: Array<Exps.Property>,
): Record<string, Exp> {
  return Object.fromEntries(
    properties.map((property) => [property.name, property.exp]),
  )
}
