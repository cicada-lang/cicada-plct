import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("compute Cons", async () => {
  const output = await runCode(`

let pair: Pair(Type, Type)  = cons(Type, Type)
compute pair

`)

  expect(output).toMatchSnapshot()
})

test("compute Cons -- inferred", async () => {
  const output = await runCode(`

let pair = cons(Type, Type)
compute pair

`)

  expect(output).toMatchSnapshot()
})
