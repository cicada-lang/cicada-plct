import { expect, test } from "bun:test"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Let -- function", () => {
  expect(parseStmts("function id(T: Type, x: T) { return x }")).toMatchObject(
    deleteUndefined([
      new Stmts.Let(
        "id",
        Exps.FnUnfolded(
          [
            Exps.FnBindingAnnotated("T", Exps.Var("Type")),
            Exps.FnBindingAnnotated("x", Exps.Var("T")),
          ],
          Exps.SequenceUnfolded([], Exps.Var("x")),
        ),
      ),
    ]),
  )
})
