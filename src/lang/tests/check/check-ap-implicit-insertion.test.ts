import { test } from "vitest"
import { runCode } from "../utils.js"

test("check ApImplicit -- insertion -- id", async () => {
  await runCode(`

function id(implicit T: Type, x: T): T {
  return x
}

check id(sole): Trivial
check id("abc"): String

`)
})

test("check ApImplicit -- insertion -- infer", async () => {
  await runCode(`

function infer(implicit T: Type, x: T): Type {
  return T
}

check infer(sole): Type
check infer("abc"): Type

`)
})
