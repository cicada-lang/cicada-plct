import { Global } from "./Value"

export class Globals {
  map: Map<string, Global> = new Map()

  lookupValue(name: string): Global | undefined {
    return this.map.get(name)
  }

  register(globalValue: Global): void {
    this.map.set(globalValue.name, globalValue)
  }
}
