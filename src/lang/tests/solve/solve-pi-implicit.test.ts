import { expect, test } from "vitest"
import * as Errors from "../../errors"
import { expectCodeToFail, runCode } from "../utils"

test("solve PiImplicit -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  unify (implicit _: A, B) -> B = (implicit _: String, String) -> String
  unify (implicit _: A, B) -> String = (implicit _: String, String) -> B
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve PiImplicit -- deepWalk", async () => {
  const output = await runCode(`

solve (A: Type, B: Type, C: Type) {
  // NOTE To test deepWalk, the order matters here.
  unify C = (implicit _: A) -> B
  unify A = String
  unify B = String
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ A: String, B: String, C: (implicit _: String) -> String }"',
  )
})

test("solve PiImplicit -- occur", async () => {
  await expectCodeToFail(
    `
  
solve (T: Type) {
  unify T = (implicit _: T) -> T
}

`,
    Errors.UnificationError,
  )
})
