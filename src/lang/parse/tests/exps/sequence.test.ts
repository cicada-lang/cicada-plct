import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Sequence", () => {
  expect(
    parseExp(
      `

{
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
      Exps.SequenceUnfolded(
        [
          Exps.SequenceBindingLetThe("x", Exps.Var("Trivial"), Exps.Var("sole")),
          Exps.SequenceBindingCheck(Exps.Var("sole"), Exps.Var("Trivial")),
          Exps.SequenceBindingLet("y", Exps.Var("sole")),
          Exps.SequenceBindingLet("z", Exps.Var("sole")),
        ],
        Exps.Var("x"),
      ),
    ),
  )
})

test("parse Sequence -- only return", () => {
  expect(
    parseExp(
      `

{
  return x
}

`,
    ),
  ).toMatchObject(deleteUndefined(Exps.SequenceUnfolded([], Exps.Var("x"))))
})

test("parse Sequence -- let function", () => {
  expect(
    parseExp(
      `

{
  function id(T: Type, x: T): T {
    return x
  }

  return id
}

`,
    ),
  ).toMatchObject(
    deleteUndefined(
      Exps.SequenceUnfolded(
        [
          Exps.SequenceBindingLet(
            "id",
            Exps.FnUnfoldedWithRetType(
              [
                Exps.FnBindingAnnotated("T", Exps.Var("Type")),
                Exps.FnBindingAnnotated("x", Exps.Var("T")),
              ],
              Exps.Var("T"),
              Exps.SequenceUnfolded([], Exps.Var("x")),
            ),
          ),
        ],
        Exps.Var("id"),
      ),
    ),
  )
})
