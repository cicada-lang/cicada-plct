import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import * as Stmts from "../../../stmts/index.js"
import { parseStmts } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Let", () => {
  expect(parseStmts("let U = Type")).toMatchObject(
    deleteUndefined([new Stmts.Let("U", Exps.Var("Type"))]),
  )
})

test("parse LetThe", () => {
  expect(parseStmts("let U: Type = Type")).toMatchObject(
    deleteUndefined([
      new Stmts.LetThe("U", Exps.Var("Type"), Exps.Var("Type")),
    ]),
  )
})
