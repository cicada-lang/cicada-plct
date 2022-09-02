import { expect, test } from "vitest"
import { ClazzBindingAbstract, FoldedClazz, Var } from "../../../exp"
import { Clazz } from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Clazz", () => {
  expect(
    parseStmts("class ABC { a: String, b: String, c: String }")
  ).toMatchObject(
    deleteUndefined([
      new Clazz(
        "ABC",
        FoldedClazz([
          ClazzBindingAbstract("a", Var("String")),
          ClazzBindingAbstract("b", Var("String")),
          ClazzBindingAbstract("c", Var("String")),
        ])
      ),
    ])
  )
})
