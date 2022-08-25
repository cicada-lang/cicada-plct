import { Core } from "./Core"
import { Env, EnvCons } from "./Env"
import { evaluate } from "./evaluate"
import { Value } from "./Value"

export type Closure = {
  env: Env
  name: string
  body: Core
}

export function Closure(env: Env, name: string, body: Core): Closure {
  return {
    env,
    name,
    body,
  }
}

export function applyClosure(closure: Closure, arg: Value): Value {
  return evaluate(EnvCons(closure.name, arg, closure.env), closure.body)
}
