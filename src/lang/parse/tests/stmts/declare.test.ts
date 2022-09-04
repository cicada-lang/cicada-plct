import { expect, test } from "vitest"
import { Var } from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Declare", () => {
  expect(parseStmts("declare t: Type")).toMatchObject(
    deleteUndefined([new Stmts.Declare("t", Var("Type"))]),
  )
})
