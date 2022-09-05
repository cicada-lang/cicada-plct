import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Conversion", () => {
  expect(
    parseStmts(`

conversion Trivial {
  sole
  sole
}

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Conversion(Exps.Var("Trivial"), [
        Exps.Var("sole"),
        Exps.Var("sole"),
      ]),
    ]),
  )
})

test("parse Conversion -- single", () => {
  expect(
    parseStmts(`

conversion Trivial {
  sole
}

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Conversion(Exps.Var("Trivial"), [Exps.Var("sole")]),
    ]),
  )
})

test("parse Conversion -- empty", () => {
  expect(
    parseStmts(`

conversion Trivial {

}

`),
  ).toMatchObject(
    deleteUndefined([new Stmts.Conversion(Exps.Var("Trivial"), [])]),
  )
})
