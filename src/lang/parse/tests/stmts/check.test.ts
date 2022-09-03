import { expect, test } from "vitest"
import { Var } from "../../../exp"
import { Check } from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Check", () => {
  expect(parseStmts("check t: Type")).toMatchObject(
    deleteUndefined([new Check(Var("t"), Var("Type"))]),
  )
})
