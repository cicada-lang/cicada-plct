import { expect, test } from "vitest"
import {
  FnBindingName,
  FoldedFn,
  FoldedPi,
  PiBindingNamed,
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

test("parse Sequence -- let function", () => {
  expect(
    parseExp(
      `
begin {
  function id(T: Type, x: T): T {
    return x
  }

  return id
}
`,
    ),
  ).toMatchObject(
    deleteUndefined(
      Sequence(
        [
          SequenceLetThe(
            "id",
            FoldedPi(
              [PiBindingNamed("T", Var("Type")), PiBindingNamed("x", Var("T"))],
              Var("T"),
            ),
            FoldedFn(
              [FnBindingName("T"), FnBindingName("x")],
              Sequence([], Var("x")),
            ),
          ),
        ],
        Var("id"),
      ),
    ),
  )
})
