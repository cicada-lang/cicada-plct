import { test } from "vitest"
import { expectCodeToFail, runCode } from "./utils"

test("check Objekt", async () => {
  await runCode(`

check {
  a: "a",
  b: "b",
  c: "c",
}: class { a: String, b: String, c: String }

`)
})

test("check Objekt -- missing property", async () => {
  await expectCodeToFail(`

check {
  a: "a",
  b: "b",
  // c: "c",
}: class { a: String, b: String, c: String }

`)
})
