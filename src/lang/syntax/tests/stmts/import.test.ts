import { expect, test } from "vitest"
import * as Stmts from "../../../stmts/index.js"
import { parseStmts } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Import", () => {
  expect(parseStmts('import { a, b, c } from "./abc.cic"')).toMatchObject(
    deleteUndefined([
      new Stmts.Import(
        [
          Stmts.ImportBindingName("a"),
          Stmts.ImportBindingName("b"),
          Stmts.ImportBindingName("c"),
        ],
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
