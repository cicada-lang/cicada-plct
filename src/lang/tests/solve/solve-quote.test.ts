import { test } from "vitest"
import { runCode } from "../utils"

test("solve Quote -- literal", async () => {
  await runCode(`

solve () {
  equation "a" = "a" : String
  equation "b" = "b" : String
  equation "c" = "c" : String
}

`)
})

test("solve Quote -- bindings", async () => {
  await runCode(`

solve (a: String, b: String, c: String) {
  equation a = "a" : String
  equation b = "b" : String
  equation c = "c" : String
}

// Solution:
// {
//   a: "a",
//   b: "b",
//   c: "c",
// }

`)
})
