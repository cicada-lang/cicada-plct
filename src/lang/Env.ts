import { Value } from "./Value"

export type Env = EnvCons | EnvNull

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

export type EnvNull = {
  kind: "EnvNull"
}

export function EnvNull(): EnvNull {
  return {
    kind: "EnvNull",
  }
}

export function lookupEnv(env: Env, name: string): Value | undefined {
  switch (env.kind) {
    case "EnvCons": {
      if (env.name === name) {
        return env.value
      } else {
        return lookupEnv(env.rest, name)
      }
    }

    case "EnvNull": {
      return undefined
    }
  }
}
