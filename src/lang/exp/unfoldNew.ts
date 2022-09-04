import * as Exps from "./Exp"
import { Exp } from "./Exp"

export function unfoldNew(name: string, properties: Array<Exps.Property>): Exp {
  return Exps.New(
    name,
    Object.fromEntries(
      properties.map((property) => [property.name, property.exp]),
    ),
  )
}
