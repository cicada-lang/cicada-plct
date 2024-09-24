import { test } from "vitest"
import { expectCodeToFail } from "../utils"

test("solve Clazz -- out of order", async () => {
  await expectCodeToFail(`

solve (A: Type, B: Type) {
  class { a: A, b: B } = class { b: String, a: String }
}

`)
})
