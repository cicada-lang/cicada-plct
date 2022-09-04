import { expect, test } from "vitest"
import * as Exps from "../../../exp"
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
      Exps.Sequence(
        [
          Exps.SequenceLetThe("x", Exps.Var("Trivial"), Exps.Var("sole")),
          Exps.SequenceCheck(Exps.Var("sole"), Exps.Var("Trivial")),
          Exps.SequenceLet("y", Exps.Var("sole")),
          Exps.SequenceLet("z", Exps.Var("sole")),
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

begin {
  return x
}

`,
    ),
  ).toMatchObject(deleteUndefined(Exps.Sequence([], Exps.Var("x"))))
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
      Exps.Sequence(
        [
          Exps.SequenceLetThe(
            "id",
            Exps.FoldedPi(
              [
                Exps.PiBindingNamed("T", Exps.Var("Type")),
                Exps.PiBindingNamed("x", Exps.Var("T")),
              ],
              Exps.Var("T"),
            ),
            Exps.FoldedFn(
              [Exps.FnBindingName("T"), Exps.FnBindingName("x")],
              Exps.Sequence([], Exps.Var("x")),
            ),
          ),
        ],
        Exps.Var("id"),
      ),
    ),
  )
})
