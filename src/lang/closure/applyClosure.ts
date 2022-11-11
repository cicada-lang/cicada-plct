import { Closure } from "../closure"
import { envExtend } from "../env"
import { evaluate } from "../evaluate"
import { Value } from "../value"

export function applyClosure(closure: Closure, arg: Value): Value {
  switch (closure.kind) {
    case "ClosureSimple": {
      return evaluate(envExtend(closure.env, closure.name, arg), closure.body)
    }

    case "ClosureNative": {
      return closure.native(arg)
    }
  }
}
