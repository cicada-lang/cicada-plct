import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute ImplicitAp -- insertion -- id", async () => {
  const output = await runCode(`

let id: (implicit T: Type, x: T) -> T = (x) => x

compute id(sole)
compute id("abc")


`)

  expect(output).toMatchInlineSnapshot(`
    "sole: Trivial
    \\"abc\\": String"
  `)
})

test("compute ImplicitAp -- insertion -- infer", async () => {
  const output = await runCode(`

let infer: (implicit T: Type, x: T) -> Type = (implicit T, x) => T

compute infer(sole)
compute infer("abc")

`)

  expect(output).toMatchInlineSnapshot(`
    "Trivial: Type
    String: Type"
  `)
})
