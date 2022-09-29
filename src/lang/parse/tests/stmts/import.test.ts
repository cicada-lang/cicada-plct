import { expect, test } from "vitest"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Import", () => {
  expect(parseStmts('import { a, b, c } from "./abc.cic"')).toMatchObject(
    deleteUndefined([
      new Stmts.Import(
        [Stmts.ImportBindingName("a"), Stmts.ImportBindingName("b"), Stmts.ImportBindingName("c")],
        "./abc.cic",
      ),
    ]),
  )
})

test("parse Import -- alias", () => {
  expect(parseStmts('import { a as hi, b, c } from "./abc.cic"')).toMatchObject(
    deleteUndefined([
      new Stmts.Import(
        [
          Stmts.ImportBindingAlias("a", "hi"),
          Stmts.ImportBindingName("b"),
          Stmts.ImportBindingName("c"),
        ],
        "./abc.cic",
      ),
    ]),
  )
})
