import { Env } from "../env"

export function deleteFirstFromEnv(env: Env, name: string): Env {
  switch (env.kind) {
    case "EnvNull": {
      return env
    }

    case "EnvCons": {
      if (env.name === name) {
        return env.rest
      } else {
        return deleteFirstFromEnv(env.rest, name)
      }
    }
  }
}
