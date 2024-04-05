import { expect, test } from "bun:test"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Check", () => {
  expect(parseStmts("check t: Type")).toMatchObject(
    deleteUndefined([new Stmts.Check(Exps.Var("t"), Exps.Var("Type"))]),
  )
})
