import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test.todo("parse Let -- function with implicit", () => {
  expect(
    parseStmts("function id(implicit T: Type, x: T): T { return x }"),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Let(
        "id",
        Exps.FoldedFnWithRetType(
          [
            Exps.FnBindingAnnotated("T", Exps.Var("Type")),
            Exps.FnBindingAnnotated("x", Exps.Var("T")),
          ],
          Exps.Var("T"),
          Exps.FoldedSequence([], Exps.Var("x")),
        ),
      ),
    ]),
  )
})
