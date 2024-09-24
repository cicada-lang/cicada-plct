import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import * as Stmts from "../../../stmts/index.js"
import { parseStmts } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Check", () => {
  expect(parseStmts("check t: Type")).toMatchObject(
    deleteUndefined([new Stmts.Check(Exps.Var("t"), Exps.Var("Type"))]),
  )
})
