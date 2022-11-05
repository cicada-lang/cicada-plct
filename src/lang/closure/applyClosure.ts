import { Closure } from "../closure"
import { evaluate } from "../core"
import { Env, EnvCons } from "../env"
import { Value } from "../value"

export function applyClosure(closure: Closure, arg: Value): Value {
  switch (closure.kind) {
    case "ClosureSimple": {
      // const env = closure.env
      const env = substInEnv(closure.env, closure.name, arg)
      return evaluate(EnvCons(closure.name, arg, env), closure.body)
    }

    case "ClosureNative": {
      return closure.native(arg)
    }
  }
}

export function substInEnv(env: Env, name: string, value: Value): Env {
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
