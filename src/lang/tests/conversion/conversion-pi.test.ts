import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Pi", async () => {
  await runCode(`

conversion Type {
  forall (T: Type, x: T) T
  forall (T: Type, y: T) T
}

conversion Type {
  forall (A: Type, x: A, B: Type, y: B) A
  forall (B: Type, y: B, A: Type, x: A) B
}

`)
})

test("conversion Pi -- fail", async () => {
  await expectCodeToFail(`

conversion Type {
  forall (A: Type, x: A, B: Type, y: B) A
  forall (A: Type, x: A, B: Type, y: B) B
}

`)
})
