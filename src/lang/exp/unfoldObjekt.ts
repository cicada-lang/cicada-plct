import * as Exps from "./Exp"
import { Exp } from "./Exp"

export function unfoldObjekt(properties: Array<Exps.Property>): Exp {
  return Exps.Objekt(
    Object.fromEntries(
      properties.map((property) => [property.name, property.exp])
    )
  )
}
