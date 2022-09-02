import { test } from "vitest"
import { expectCodeToFail, runCode } from "./utils"

test("check Objekt", async () => {
  await runCode(`

let abc: class { a: String, b: String, c: String } = {
  a: "a",
  b: "b",
  c: "c",
}

`)
})

test("check Objekt -- missing property", async () => {
  await expectCodeToFail(`

let abc: class { a: String, b: String, c: String } = {
  a: "a",
  b: "b",
  // c: "c",
}

`)
})
