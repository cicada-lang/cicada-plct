import { Closure } from "../closure"
import { evaluate } from "../core"
import { EnvCons } from "../env"
import { SolutionNull } from "../solution"
import { Value } from "../value"

export function applyClosure(closure: Closure, arg: Value): Value {
  // TODO need real `solution` or good `env` in `closure`.
  return evaluate(
    SolutionNull(),
    EnvCons(closure.name, arg, closure.env),
    closure.body,
  )
}
