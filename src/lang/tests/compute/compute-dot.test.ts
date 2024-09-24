import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Dot", async () => {
  const output = await runCode(`

let abc = { a: "a", b: "b", c: "c" }
compute abc.a
compute abc.b
compute abc.c

`)

  expect(output).toMatchSnapshot()
})
