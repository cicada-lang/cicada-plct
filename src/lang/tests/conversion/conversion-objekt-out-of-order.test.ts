import { test } from "vitest"
import { runCode } from "../utils"

test("conversion Objekt -- out of order", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

conversion class { A: Type, x: A, y: A } [
  { A: String, x: "abc", y: "xyz" },
  { A: String, y: "xyz", x: "abc" },
  { A: String, x: id(String, "abc"), y: id(String, "xyz") },
  { A: String, y: id(String, "xyz"), x: id(String, "abc") },
]

`)
})
