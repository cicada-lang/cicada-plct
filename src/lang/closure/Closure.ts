import type { Core } from "../core/index.js"
import type { Env } from "../env/index.js"
import type { Value } from "../value/index.js"

export type Closure = ClosureSimple | ClosureNative

export type ClosureSimple = {
  "@kind": "ClosureSimple"
  env: Env
  name: string
  body: Core
}

export function ClosureSimple(env: Env, name: string, body: Core): Closure {
  return {
    "@kind": "ClosureSimple",
    env,
    name,
    body,
  }
}

export type ClosureNative = {
  "@kind": "ClosureNative"
  name: string
  native: (arg: Value) => Value
}

export function ClosureNative(
  name: string,
  native: (arg: Value) => Value,
): ClosureNative {
  return {
    "@kind": "ClosureNative",
    name,
    native,
  }
}
