import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import * as Stmts from "../../../stmts/index.js"
import { parseStmts } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Let -- function with return type", () => {
  expect(
    parseStmts("function id(T: Type, x: T): T { return x }"),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Let(
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
    ]),
  )
})
