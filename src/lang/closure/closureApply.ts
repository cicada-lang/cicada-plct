import type { Closure } from "../closure/index.js"
import { EnvCons } from "../env/index.js"
import { evaluate } from "../evaluate/index.js"
import type { Value } from "../value/index.js"

export function closureApply(closure: Closure, arg: Value): Value {
  switch (closure["@kind"]) {
    case "ClosureSimple": {
      return evaluate(EnvCons(closure.name, arg, closure.env), closure.body)
    }

    case "ClosureNative": {
      return closure.native(arg)
    }
  }
}
