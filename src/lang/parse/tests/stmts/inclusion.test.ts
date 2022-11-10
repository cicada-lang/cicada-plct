import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Inclusion", () => {
  expect(
    parseStmts(`

include [
  Trivial,
  Trivial,
]

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Inclusion([Exps.Var("Trivial"), Exps.Var("Trivial")]),
    ]),
  )
})

test("parse Inclusion -- without last comma", () => {
  expect(
    parseStmts(`

include [
  Trivial,
  Trivial
]

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Inclusion([Exps.Var("Trivial"), Exps.Var("Trivial")]),
    ]),
  )
})

test("parse Inclusion -- single", () => {
  expect(
    parseStmts(`

include [
  Trivial,
]

`),
  ).toMatchObject(deleteUndefined([new Stmts.Inclusion([Exps.Var("Trivial")])]))
})
