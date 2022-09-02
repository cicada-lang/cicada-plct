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

test("check Objekt -- dependent", async () => {
  await runCode(`

check {
  T: String,
  x: "x",
}: class { T: Type, x: T }

`)

  await expectCodeToFail(`

check {
  T: String,
  x: Type,
}: class { T: Type, x: T }

`)
})
