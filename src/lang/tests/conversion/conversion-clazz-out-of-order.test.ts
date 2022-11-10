import { test } from "vitest"
import { runCode } from "../utils"

test("conversion Clazz -- out of order", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

conversion Type [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { B: Type, A: Type, pair: Pair(A, B) },
  class { B: Type, A: id(Type, Type), pair: Pair(A, B) },
  class { B: Type, A: id(Type, Type), pair: Pair(id(Type, A), id(Type, B)) },
]

`)
})
