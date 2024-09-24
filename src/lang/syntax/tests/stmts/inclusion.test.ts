import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import * as Stmts from "../../../stmts/index.js"
import { parseStmts } from "../../index.js"
import { deleteUndefined } from "../utils.js"

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
      new Stmts.Include([Exps.Var("Trivial"), Exps.Var("Trivial")]),
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
      new Stmts.Include([Exps.Var("Trivial"), Exps.Var("Trivial")]),
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
  ).toMatchObject(deleteUndefined([new Stmts.Include([Exps.Var("Trivial")])]))
})
