import { Value } from "./Value"

export type Env = EnvCons | EnvNull

export type EnvCons = {
  kind: "EnvCons"
  name: string
  value: Value
}

export function EnvCons(name: string, value: Value): EnvCons {
  return {
    kind: "EnvCons",
    name,
    value,
  }
}

export type EnvNull = {
  kind: "EnvNull"
}

export function EnvNull(): EnvNull {
  return {
    kind: "EnvNull",
  }
}
