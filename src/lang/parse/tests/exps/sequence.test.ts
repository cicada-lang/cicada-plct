import { expect, test } from "vitest"
import {
  Sequence,
  SequenceCheck,
  SequenceLet,
  SequenceLetThe,
  Var,
} from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Sequence", () => {
  expect(
    parseExp(
      `
begin {
  let x: Trivial = sole
  check sole: Trivial
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
          SequenceCheck(Var("sole"), Var("Trivial")),
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
