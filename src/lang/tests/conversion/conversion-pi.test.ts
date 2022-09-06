import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Pi", async () => {
  await runCode(`

conversion Type {
  (T: Type, x: T) -> T
  (T: Type, y: T) -> T
}

conversion Type {
  (A: Type, x: A, B: Type, y: B) -> A
  (B: Type, y: B, A: Type, x: A) -> B
}

`)
})

test("conversion Pi -- fail", async () => {
  await expectCodeToFail(`

conversion Type {
  (A: Type, x: A, B: Type, y: B) -> A
  (A: Type, x: A, B: Type, y: B) -> B
}

`)
})
