import type { Env } from "../env"

export function envDeleteFirst(env: Env, name: string): Env {
  switch (env["@kind"]) {
    case "EnvNull": {
      return env
    }

    case "EnvCons": {
      if (env.name === name) {
        return env.rest
      } else {
        return envDeleteFirst(env.rest, name)
      }
    }
  }
}
