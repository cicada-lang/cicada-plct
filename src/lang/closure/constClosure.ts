import { Closure } from "../closure"
import * as Cores from "../core"
import { EnvCons, EnvNull } from "../env"
import { Solution } from "../solution"
import { Value } from "../value"

export function constClosure(solution: Solution, value: Value): Closure {
  const env = EnvCons("constValue", value, EnvNull())
  return Closure(solution, env, "_", Cores.Var("constValue"))
}
