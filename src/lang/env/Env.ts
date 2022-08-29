import { Value } from "../value"

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

export function lookupEnvValue(env: Env, name: string): Value | undefined {
  switch (env.kind) {
    case "EnvCons": {
      if (env.name === name) {
        return env.value
      } else {
        return lookupEnvValue(env.rest, name)
      }
    }

    case "EnvNull": {
      return undefined
    }
  }
}
