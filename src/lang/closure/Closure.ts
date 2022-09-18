import { Core } from "../core"
import { Env } from "../env"
import { Solution } from "../solution"

export type Closure = {
  solution: Solution
  env: Env
  name: string
  body: Core
}

export function Closure(
  solution: Solution,
  env: Env,
  name: string,
  body: Core,
): Closure {
  return {
    solution,
    env,
    name,
    body,
  }
}
