import { expect, test } from "vitest"
import { ClazzBindingAbstract, FoldedClazz, Var } from "../../../exp"
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
        FoldedClazz([
          ClazzBindingAbstract("a", Var("String")),
          ClazzBindingAbstract("b", Var("String")),
          ClazzBindingAbstract("c", Var("String")),
        ]),
      ),
    ]),
  )
})
