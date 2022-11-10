import { test } from "vitest"
import { runCode } from "../utils"

test("inclusion Clazz -- out of order", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

inclusion [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { B: Type, A: Type, pair: Pair(A, B) },
  class { B: Type, A: Type },
  class { A: Type },
]

inclusion [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { B: Type, A: Type, pair: Pair(A, B) },
  class { B: Type, A: Type },
  class { B: Type },
]

inclusion [
  class { B: Type, A: id(Type, Type), pair: Pair(A, B) },
  class { B: Type, A: id(Type, Type), pair: Pair(id(Type, A), id(Type, B)) },
  class { B: Type, A: Type },
  class { A: Type, B: id(Type, Type) },
  class { B: Type },
  class { B: id(Type, Type) },
]

inclusion [
  class { B: Type, A: id(Type, Type), pair: Pair(A, B) },
  class { B: Type, A: id(Type, Type), pair: Pair(id(Type, A), id(Type, B)) },
  class { B: Type, A: Type },
  class { A: Type },
]

`)
})
