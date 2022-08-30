import { Env } from "../env"
import { Value } from "../value"

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
