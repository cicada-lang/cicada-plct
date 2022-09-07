import * as Cores from "../core"
import { EnvCons, EnvNull } from "../env"
import { Closure, Value } from "../value"

/**

   It is important that `constClosure` uses the given name to build `Closure`,
   because `alphaEquivalent` will compare names.

**/

export function constClosure(name: string, value: Value): Closure {
  const env = EnvCons("ret", value, EnvNull())
  return Closure(env, name, Cores.Var("ret"))
}
