import { expect, test } from "vitest"
import { Sequence, SequenceLet, SequenceLetThe, Var } from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Sequence", () => {
  expect(
    parseExp(
      `
begin {
  let x: Trivial = sole
  let y = sole
  let z = sole
  return x
}
`,
    ),
  ).toMatchObject(
    deleteUndefined(
      Sequence(
        [
          SequenceLetThe("x", Var("Trivial"), Var("sole")),
          SequenceLet("y", Var("sole")),
          SequenceLet("z", Var("sole")),
        ],
        Var("x"),
      ),
    ),
  )
})

test("parse Sequence -- only return", () => {
  expect(
    parseExp(
      `
begin {
  return x
}
`,
    ),
  ).toMatchObject(deleteUndefined(Sequence([], Var("x"))))
})
