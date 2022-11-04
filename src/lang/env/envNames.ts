import { Env } from "../env"

export function envNames(env: Env, names: Array<string> = []): Array<string> {
  while (env.kind !== "EnvNull") {
    names.unshift(env.name)
    env = env.rest
  }

  return names
}
