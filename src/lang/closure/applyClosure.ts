import { Closure } from "../closure"
import { EnvCons } from "../env"
import { evaluate } from "../evaluate"
import { Value } from "../value"

export function applyClosure(closure: Closure, arg: Value): Value {
  switch (closure.kind) {
    case "ClosureSimple": {
      return evaluate(EnvCons(closure.name, arg, closure.env), closure.body)
    }

    case "ClosureNative": {
      return closure.native(arg)
    }
  }
}
