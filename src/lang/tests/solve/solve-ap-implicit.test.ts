import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve ApImplicit -- same PatternVar", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String) {
  equation id(x) = id(x)
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ id: TODO((implicit T2: Type, x1: T2) -> T2), x: TODO(String) }"',
  )
})

test("solve ApImplicit -- PatternVar v.s. String", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String, A: Type) {
  equation id(implicit String, x) = id(implicit A, "abc")
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ id: TODO((implicit T: Type, x1: T) -> T), x: \\"abc\\", A: String }"',
  )
})

test("solve ApImplicit -- insertion", async () => {
  const output = await runCode(`

solve (id: (implicit T: Type, x: T) -> T, x: String) {
  equation id(x) = id("abc")
}

`)

  expect(output).toMatchInlineSnapshot(
    '"{ id: TODO((implicit T2: Type, x1: T2) -> T2), x: \\"abc\\" }"',
  )
})
