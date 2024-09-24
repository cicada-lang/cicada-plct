import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import * as Stmts from "../../../stmts/index.js"
import { parseStmts } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Clazz", () => {
  expect(
    parseStmts("class ABC { a: String, b: String, c: String }"),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Clazz(
        "ABC",
        Exps.ClazzUnfolded([
          Exps.ClazzBindingAbstract("a", Exps.Var("String")),
          Exps.ClazzBindingAbstract("b", Exps.Var("String")),
          Exps.ClazzBindingAbstract("c", Exps.Var("String")),
        ]),
      ),
    ]),
  )
})
