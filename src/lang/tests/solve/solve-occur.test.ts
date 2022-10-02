import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("solve occur -- occur in pair", async () => {
  await expectCodeToFail(`

solve (x: Type) {
  unify x = Pair(x, x)
}

`)
})

test("solve occur -- shadow by lambda", async () => {
  const output = await runCode(`
  
solve (X: Type) {
  unify X = (X: Type) -> X
}
  
`)

  expect(output).toMatchInlineSnapshot('"{ X: (X1: Type) -> X1 }"')
})
