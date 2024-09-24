import { test } from "vitest"
import { expectCodeToFail } from "../utils.js"

test("compute ApImplicit -- scope", async () => {
  await expectCodeToFail(`

function id(implicit A: Type, x: A): A {
  return x
}

compute id((x: A) => x)

`)

  await expectCodeToFail(`

function id(implicit A: Type, x: A): A {
  return x
}

compute id(id(id((x: A1) => x)))

`)
})
