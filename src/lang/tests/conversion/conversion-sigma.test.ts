import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("conversion Sigma", async () => {
  await runCode(`

conversion Type {
  exists (A: Type) A
  exists (B: Type) B
}

conversion Type {
  exists (A: Type, B: Type) Pair(A, B)
  exists (B: Type, A: Type) Pair(B, A)
}

`)
})

test("conversion Sigma -- fail", async () => {
  await expectCodeToFail(`

conversion Type {
  exists (A: Type, B: Type) Pair(A, B)
  exists (A: Type, B: Type) Pair(B, A)
}

`)
})
