import { expect, test } from "bun:test"
import { runCode } from "../utils"

test("equivalent Objekt -- out of order", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent class { A: Type, x: A, y: A } {
    { A: String, x: "abc", y: "xyz" }
  = { A: String, y: "xyz", x: "abc" }
  = { A: String, x: id(String, "abc"), y: id(String, "xyz") }
  = { A: String, y: id(String, "xyz"), x: id(String, "abc") }
}

`)

  expect(output).toMatchSnapshot()
})
