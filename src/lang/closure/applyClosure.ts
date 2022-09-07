import { Closure } from "../closure"
import { evaluate } from "../core"
import { EnvCons } from "../env"
import { Value } from "../value"

export function applyClosure(closure: Closure, arg: Value): Value {
  return evaluate(EnvCons(closure.name, arg, closure.env), closure.body)
}
