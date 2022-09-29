import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Let", () => {
  expect(parseStmts("let U = Type")).toMatchObject(
    deleteUndefined([new Stmts.Let("U", Exps.Var("Type"))]),
  )
})

test("parse LetThe", () => {
  expect(parseStmts("let U: Type = Type")).toMatchObject(
    deleteUndefined([new Stmts.LetThe("U", Exps.Var("Type"), Exps.Var("Type"))]),
  )
})
