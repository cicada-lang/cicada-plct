import { Closure } from "../closure"
import { evaluate } from "../core"
import { extendEnv } from "../env"
import { Value } from "../value"

export function applyClosure(closure: Closure, arg: Value): Value {
  switch (closure.kind) {
    case "ClosureSimple": {
      return evaluate(extendEnv(closure.env, closure.name, arg), closure.body)
    }

    case "ClosureNative": {
      return closure.native(arg)
    }
  }
}
