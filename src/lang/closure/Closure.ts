import { Core } from "../core"
import { Env } from "../env"

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
