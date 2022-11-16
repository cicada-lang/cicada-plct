import type { Core } from "../core"
import type { Env } from "../env"
import type { Value } from "../value"

export type Closure = ClosureSimple | ClosureNative

export type ClosureSimple = {
  kind: "ClosureSimple"
  env: Env
  name: string
  body: Core
}

export function ClosureSimple(env: Env, name: string, body: Core): Closure {
  return {
    kind: "ClosureSimple",
    env,
    name,
    body,
  }
}

export type ClosureNative = {
  kind: "ClosureNative"
  name: string
  native: (arg: Value) => Value
}

export function ClosureNative(
  name: string,
  native: (arg: Value) => Value,
): ClosureNative {
  return {
    kind: "ClosureNative",
    name,
    native,
  }
}
