import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Replace", async () => {
  const output = await runCode(`

function equal_compose(
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

compute equal_compose(sole_eq, sole_eq)
compute equal_compose(equal_compose(sole_eq, sole_eq), equal_compose(sole_eq, sole_eq))

`)

  expect(output).toMatchInlineSnapshot(
    `
    "refl(implicit Trivial, implicit sole): Equal(Trivial, sole, sole)
    refl(implicit Trivial, implicit sole): Equal(Trivial, sole, sole)"
  `,
  )
})
