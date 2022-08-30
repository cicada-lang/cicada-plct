import { Core, evaluate } from "../core"
import { Env, EnvCons, EnvNull } from "../env"
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

export function coreToClosure(core: Core): Closure {
  return Closure(EnvNull(), "", core)
}
