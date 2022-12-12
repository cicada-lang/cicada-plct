import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("equivalent Clazz", async () => {
  const output = await runCode(`

function id(T: Type, x: T): T {
  return x
}

compute equivalent Type {
    class { A: Type, x: A }
  = class { A: Type, x: A }
  = class { A: Type, x: id(Type, A) }
}

`)

  expect(output).toMatchInlineSnapshot(`
    "refl(
      implicit Type,
      implicit class {
        A: Type
        x [rename: x2]: A
      },
    ): Equal(
      Type,
      class {
        A: Type
        x [rename: x2]: A
      },
      class {
        A: Type
        x [rename: x2]: A
      },
    )"
  `)
})

test("equivalent Clazz -- Pair in class", async () => {
  const output = await runCode(`


compute equivalent Type {
    class { A: Type, B: Type, pair: Pair(A, B) }
  = class { A: Type, B: Type, pair: Pair(A, B) }
}

`)

  expect(output).toMatchInlineSnapshot(`
    "refl(
      implicit Type,
      implicit class {
        A: Type
        B: Type
        pair: Pair(A, B)
      },
    ): Equal(
      Type,
      class {
        A: Type
        B: Type
        pair: Pair(A, B)
      },
      class {
        A: Type
        B: Type
        pair: Pair(A, B)
      },
    )"
  `)
})

test("equivalent Clazz -- fail -- different property names", async () => {
  await expectCodeToFail(`

compute equivalent Type {
    class { A: Type, x: A }
  = class { B: Type, x: B }
}

`)
})

test("equivalent Clazz -- fail -- different property type", async () => {
  await expectCodeToFail(`

compute equivalent Type {
    class { A: Trivial }
  = class { A: String }
}

`)
})

test("equivalent Clazz -- fail -- different fulfilled property value", async () => {
  await expectCodeToFail(`

compute equivalent Type {
    class { A: String = "abc" }
  = class { A: String = "xyz" }
}

`)
})

test.todo(
  "equivalent Clazz -- fail -- missing fulfilled property value",
  async () => {
    await expectCodeToFail(`

compute equivalent Type {
    class { A: String = "abc" }
  = class { A: String }
}

`)

    await expectCodeToFail(`

compute equivalent Type {
    class { A: String }
  = class { A: String = "abc" }
}

`)
  },
)

test.todo("equivalent Clazz -- fail -- missing property type", async () => {
  await expectCodeToFail(`

compute equivalent Type {
    class { A: String, B: String }
  = class { A: String }
}

`)

  await expectCodeToFail(`

compute equivalent Type {
    class { A: String }
  = class { A: String, B: String }
}

`)
})
