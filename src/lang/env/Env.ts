import { Value } from "../value"

export type Env = EnvNull | EnvCons

export type EnvNull = {
  kind: "EnvNull"
}

export function EnvNull(): EnvNull {
  return {
    kind: "EnvNull",
  }
}

export type EnvCons = {
  kind: "EnvCons"
  name: string
  value: Value
  rest: Env
}

export function EnvCons(name: string, value: Value, rest: Env): EnvCons {
  return {
    kind: "EnvCons",
    name,
    value,
    rest,
  }
}
