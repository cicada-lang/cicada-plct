import { test } from "vitest"
import { runCode } from "../utils"

test("check Objekt -- spread", async () => {
  await runCode(`

let bc: class { b: String, c: String } = {
  b: "b",
  c: "c",
}

check {
  a: "a",
  ...bc,
}: class { a: String, b: String, c: String }

`)
})
