import { expect, test } from "vitest"
import { runCode } from "../utils"

/**

   TODO We need to design a failing test,
   before we try to fix `inferApPiImplicit`.

**/

/**

   TODO We need to test throw `LangError`,
   intead of using `expectCodeToFail` which assert all errors.

**/

test.todo("compute ApImplicit -- scope", async () => {
  const output = await runCode(`

function id(implicit A: Type, x: A): A {
  return x
}

compute id((x: A) => x)
// compute id((x: A1) => x)
// compute id(id((x: A1) => x))
// compute id(id(id((x: A1) => x)))

`)

  expect(output).toMatchInlineSnapshot()
})
