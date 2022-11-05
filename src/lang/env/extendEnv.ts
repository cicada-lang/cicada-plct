import { Env, EnvCons } from "../env"
import { Value } from "../value"

export function extendEnv(env: Env, name: string, value: Value): Env {
  return EnvCons(name, value, substInEnv(env, name, value))
}

function substInEnv(env: Env, name: string, value: Value): Env {
  if (value.kind === "TypedNeutral" && value.neutral.kind === "Var") {
    return env
  }

  switch (env.kind) {
    case "EnvNull": {
      return env
    }

    case "EnvCons": {
      if (
        env.value.kind === "TypedNeutral" &&
        env.value.neutral.kind === "Var" &&
        env.value.neutral.name === name
      ) {
        return EnvCons(env.name, value, substInEnv(env.rest, name, value))
      } else {
        return EnvCons(env.name, env.value, substInEnv(env.rest, name, value))
      }
    }
  }
}
