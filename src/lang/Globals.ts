import { Global, Value } from "./Value"

class Globals {
  map: Map<string, Global> = new Map()

  lookupValue(name: string): Global | undefined {
    return this.map.get(name)
  }

  register(globalValue: Global): void {
    this.map.set(globalValue.name, globalValue)
  }
}

export const globals = new Globals()

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

globals.register(buildTheType())
