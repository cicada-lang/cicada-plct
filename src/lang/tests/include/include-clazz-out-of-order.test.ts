import { test } from "vitest"
import { runCode } from "../utils"

test("include Clazz -- out of order", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

include [
  class { A: Type },
  class { B: Type, A: Type },
  class { B: Type, A: Type, pair: Pair(A, B) },
  class { A: Type, B: Type, pair: Pair(A, B) },
]

include [
  class { B: Type },
  class { B: Type, A: Type },
  class { B: Type, A: Type, pair: Pair(A, B) },
  class { A: Type, B: Type, pair: Pair(A, B) },
]

include [
  class { B: id(Type, Type) },
  class { B: Type },
  class { A: Type, B: id(Type, Type) },
  class { B: Type, A: Type },
  class { B: Type, A: id(Type, Type), pair: Pair(id(Type, A), id(Type, B)) },
  class { B: Type, A: id(Type, Type), pair: Pair(A, B) },
]

include [
  class { A: Type },
  class { B: Type, A: Type },
  class { B: Type, A: id(Type, Type), pair: Pair(id(Type, A), id(Type, B)) },
  class { B: Type, A: id(Type, Type), pair: Pair(A, B) },
]

`)
})
