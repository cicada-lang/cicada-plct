import { Env } from "../env"
import { Value } from "../value"

export function lookupValueInEnv(env: Env, name: string): Value | undefined {
  while (env.kind !== "EnvNull") {
    if (env.name === name) return env.value
    env = env.rest
  }

  return undefined
}
