import { Global } from "./Value"

class Globals {
  map: Map<string, Global> = new Map()

  lookupValue(name: string): Global | undefined {
    return this.map.get(name)
  }

  define(name: string, globalValue: Global): void {
    this.map.set(name, globalValue)
  }
}

export const globals = new Globals()
