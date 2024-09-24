import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils.js"

test("check Same", async () => {
  await runCode(`

check same("abc"): Equal(String, "abc", "abc")

`)
})

test("check Same -- fail", async () => {
  await expectCodeToFail(`

check same("abc"): Equal(String, "123", "123")

`)
})

test("check Same -- given implicit", async () => {
  await runCode(`

check same(implicit String, "abc"): Equal(String, "abc", "abc")

`)
})

test("check Same -- given implicit -- fail", async () => {
  await expectCodeToFail(`

check same(implicit String, "abc"): Equal(String, "123", "123")

`)
})
