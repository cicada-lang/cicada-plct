import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Inclusion", () => {
  expect(
    parseStmts(`

inclusion [
  Trivial,
  Trivial,
]

`),
  ).toMatchObject(
    deleteUndefined([new Stmts.Inclusion([Exps.Var("Trivial"), Exps.Var("Trivial")])]),
  )
})

test("parse Inclusion -- without last comma", () => {
  expect(
    parseStmts(`

inclusion [
  Trivial,
  Trivial
]

`),
  ).toMatchObject(
    deleteUndefined([new Stmts.Inclusion([Exps.Var("Trivial"), Exps.Var("Trivial")])]),
  )
})

test("parse Inclusion -- single", () => {
  expect(
    parseStmts(`

inclusion [
  Trivial,
]

`),
  ).toMatchObject(deleteUndefined([new Stmts.Inclusion([Exps.Var("Trivial")])]))
})
