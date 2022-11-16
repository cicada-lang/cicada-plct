import type { Env } from "../env"
import type { Value } from "../value"

export function envLookupValue(env: Env, name: string): Value | undefined {
  while (env.kind !== "EnvNull") {
    if (env.name === name) return env.value
    env = env.rest
  }

  return undefined
}
