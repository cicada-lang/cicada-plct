import { Env, EnvCons } from "../env"
import { Value } from "../value"

export function envExtend(env: Env, name: string, value: Value): Env {
  return EnvCons(name, value, substInEnv(env, name, value))
}

/**

   We need `substInEnv` because implicit application insertion
   will insert pattern variable
   and the solution of the pattern variable might be `Neutrals.Var`.

**/

function substInEnv(env: Env, name: string, value: Value): Env {
  /**
     TODO I do not know why we need the following line.
   **/

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
