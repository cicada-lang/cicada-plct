import { expect, test } from "vitest"
import { Var } from "../../../exp"
import { Declare } from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Declare", () => {
  expect(parseStmts("declare t: Type")).toMatchObject(
    deleteUndefined([new Declare("t", Var("Type"))]),
  )
})
