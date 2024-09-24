import type { Env } from "../env/index.js"
import type { Value } from "../value/index.js"

export function envLookupValue(env: Env, name: string): Value | undefined {
  while (env["@kind"] !== "EnvNull") {
    if (env.name === name) return env.value
    env = env.rest
  }

  return undefined
}
