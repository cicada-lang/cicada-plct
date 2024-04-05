import { test } from "bun:test"
import { expectCodeToFail, runCode } from "../utils"

test("include Clazz -- out of order", async () => {
  await runCode(`

include [
  class { A: Type },
  class { B: Type, A: Type },
]

`)

  await runCode(`

include [
  class { B: Type },
  class { B: Type, A: Type },
]

`)

  await runCode(`

include [
  class { B: Type },
  class { A: Type, B: Type, C: Type },
]

`)

  await expectCodeToFail(`

include [
  class { B: Type, A: Type },
  class { A: Type, B: Type },
]

`)
})
