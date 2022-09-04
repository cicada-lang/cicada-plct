import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Declare", () => {
  expect(parseStmts("declare t: Type")).toMatchObject(
    deleteUndefined([new Stmts.Declare("t", Exps.Var("Type"))]),
  )
})
