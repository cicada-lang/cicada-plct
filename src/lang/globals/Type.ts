import { Global, Value } from "../value"

function buildTheType(): Global {
  const theType: Omit<Global, "type"> & { type?: Value } = {
    family: "Value",
    kind: "Global",
    name: "Type",
    arity: 0,
  }

  theType.type = theType as Value

  return theType as Global
}

export const Type = buildTheType()
