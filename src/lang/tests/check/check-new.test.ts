import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check New", async () => {
  await runCode(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC {
  a: "a",
  b: "b",
  c: "c",
}: ABC

`)
})

test("check New -- missing property", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC {
  a: "a",
  b: "b",
  // c: "c",
}: ABC

`)
})

test("check New -- fulfilled", async () => {
  await runCode(`

class AB {
  a: String
  b: String = a
}

check new AB {
  a: "a",
}: AB

`)
})
