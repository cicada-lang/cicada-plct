import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent String", async () => {
  const output = await runCode(`

compute equivalent Type {
    String
  = String
  = String
}

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit Type, implicit String): Equal(Type, String, String)"',
  )
})

test("equivalent String -- fail", async () => {
  await expectCodeToFail(`

compute equivalent Type {
    String
  = String
  = Type
}

`)
})
