import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Let -- function", () => {
  expect(
    parseStmts("function id(T: Type, x: T): T { return x }"),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.LetThe(
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
          Exps.FoldedSequence([], Exps.Var("x")),
        ),
      ),
    ]),
  )
})
