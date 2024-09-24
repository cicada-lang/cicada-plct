import { expect, test } from "vitest"
import * as Errors from "../../errors"
import { expectCodeToFail, runCode } from "../utils"

test("solve PiImplicit -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  (implicit _: A, B) -> B = (implicit _: String, String) -> String
  (implicit _: A, B) -> String = (implicit _: String, String) -> B
}

`)

  expect(output).toMatchSnapshot()
})

test("solve PiImplicit -- deepWalk", async () => {
  const output = await runCode(`

solve (A: Type, B: Type, C: Type) {
  // NOTE To test deepWalk, the order matters here.
  C = (implicit _: A) -> B
  A = String
  B = String
}

`)

  expect(output).toMatchSnapshot()
})

test("solve PiImplicit -- occur", async () => {
  await expectCodeToFail(
    `
  
solve (T: Type) {
  T = (implicit _: T) -> T
}

`,
    Errors.ElaborationError,
  )
})
