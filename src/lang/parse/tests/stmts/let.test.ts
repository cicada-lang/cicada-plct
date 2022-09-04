import { expect, test } from "vitest"
import { Var } from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Let", () => {
  expect(parseStmts("let U = Type")).toMatchObject(
    deleteUndefined([new Stmts.Let("U", Var("Type"))]),
  )
})

test("parse LetThe", () => {
  expect(parseStmts("let U: Type = Type")).toMatchObject(
    deleteUndefined([new Stmts.LetThe("U", Var("Type"), Var("Type"))]),
  )
})
