import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Objekt", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

equivalent class { A: Type, x: A } [
  { A: Trivial, x: sole },
  { A: Trivial, x: sole },
  { A: Trivial, x: id(Trivial, sole) },
]

`)
})

test("equivalent Objekt -- fail", async () => {
  await expectCodeToFail(`

function id(T: Type, x: T): T {
  return x
}

equivalent class { A: Type, x: A, y: A } [
  { A: String, x: "abc", y: "xyz" },
  { A: String, y: "xyz", x: "abcd" },
]

equivalent class { A: Type, x: A, y: A } [
  { A: String, x: id(String, "abcd"), y: id(String, "xyz") },
  { A: String, y: id(String, "xyz"), x: id(String, "abc") },
]

`)
})
