import { expect, test } from "vitest"
import { runCode } from "../utils"

test("equivalent Type", async () => {
  const output = await runCode(`

compute equivalent Type {
    Type
  = Type
}

`)

  expect(output).toMatchInlineSnapshot(
    '"refl(implicit Type, implicit Type): Equal(Type, Type, Type)"',
  )
})
