import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Clazz", () => {
  expect(
    parseStmts("class ABC { a: String, b: String, c: String }"),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Clazz(
        "ABC",
        Exps.FoldedClazz([
          Exps.ClazzBindingAbstract("a", Exps.Var("String")),
          Exps.ClazzBindingAbstract("b", Exps.Var("String")),
          Exps.ClazzBindingAbstract("c", Exps.Var("String")),
        ]),
      ),
    ]),
  )
})
