import { expect, test } from "vitest"
import { runCode } from "../utils"

test("equivalent Objekt -- out of order", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent class { A: Type, x: A, y: A } {
    { A: String, x: "abc", y: "xyz" }
  = { A: String, y: "xyz", x: "abc" }
  = { A: String, x: id(String, "abc"), y: id(String, "xyz") }
  = { A: String, y: id(String, "xyz"), x: id(String, "abc") }
}

`)

  expect(output).toMatchInlineSnapshot(`
    "refl(
      implicit class {
        A: Type
        x [rename: x5]: A
        y: A
      },
      implicit {
        A: String,
        x: \\"abc\\",
        y: \\"xyz\\"
      },
    ): Equal(
      class {
        A: Type
        x [rename: x5]: A
        y: A
      },
      {
        A: String,
        x: \\"abc\\",
        y: \\"xyz\\"
      },
      {
        A: String,
        x: \\"abc\\",
        y: \\"xyz\\"
      },
    )"
  `)
})
