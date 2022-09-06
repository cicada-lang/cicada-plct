import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Clazz", async () => {
  await runCode(`

conversion Type [
  class { A: Type, x: A },
  class { A: Type, x: A },
]

conversion Type [
  class { A: Type, B: Type, pair: Pair(A, B) },
  class { A: Type, B: Type, pair: Pair(A, B) },
]

`)
})

test.todo("conversion Clazz -- fail", async () => {
  await expectCodeToFail(`

conversion Type [
  class { A: Type, x: A },
  class { B: Type, x: B },
]

`)
})
