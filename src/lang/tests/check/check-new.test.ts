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

test("check New -- dependent", async () => {
  await runCode(`

class TX {
  T: Type
  x: T
}

check new TX {
  T: String,
  x: "x",
}: TX

  `)

  await expectCodeToFail(`

class TX {
  T: Type
  x: T
}

check new TX {
  T: String,
  x: Type,
}: TX

`)
})

test("check New -- duplicate properties", async () => {
  await expectCodeToFail(`

class ABC {
  a: String
  b: String
  c: String
}

check new ABC {
  a: "a",
  b: "b",
  c: "c",
  a: "a",
}: ABC

`)
})

test("check New -- extra properties", async () => {
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
  d: "d",
}: ABC

`)
})
