import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Replace -- just replace", async () => {
  const output = await runCode(`

compute replace

`)

  expect(output).toMatchInlineSnapshot(
    `
    "(
      implicit T,
      implicit from,
      implicit to,
      target,
      motive,
      base,
    ) => replace(target, motive, base): (
      implicit T: Type,
      implicit from: T,
      implicit to: T,
      Equal(T, from, to),
      motive: (T) -> Type,
      motive(from),
    ) -> motive(to)"
  `,
  )
})

test("compute Replace", async () => {
  const output = await runCode(`

function equalCompose(
  implicit A: Type,
  implicit x: A,
  implicit y: A,
  xy_equal: Equal(A, x, y),
  implicit z: A,
  yz_equal: Equal(A, y, z),
): Equal(A, x, z) {
  return replace(
    yz_equal,
    (w) => Equal(A, x, w),
    xy_equal,
  )
}

let sole_eq: Equal(Trivial, sole, sole) = refl

compute equalCompose(sole_eq, sole_eq)
compute equalCompose(equalCompose(sole_eq, sole_eq), equalCompose(sole_eq, sole_eq))

`)

  expect(output).toMatchInlineSnapshot(
    `
    "refl(implicit Trivial, implicit sole): Equal(Trivial, sole, sole)
    refl(implicit Trivial, implicit sole): Equal(Trivial, sole, sole)"
  `,
  )
})
