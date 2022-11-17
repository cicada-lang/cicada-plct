import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Equivalent", () => {
  expect(
    parseStmts(`

equivalent Trivial [
  sole,
  sole,
]

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Equivalent(Exps.Var("Trivial"), [
        Exps.Var("sole"),
        Exps.Var("sole"),
      ]),
    ]),
  )
})

test("parse Equivalent -- without last comma", () => {
  expect(
    parseStmts(`

equivalent Trivial [
  sole,
  sole
]

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Equivalent(Exps.Var("Trivial"), [
        Exps.Var("sole"),
        Exps.Var("sole"),
      ]),
    ]),
  )
})

test("parse Equivalent -- single", () => {
  expect(
    parseStmts(`

equivalent Trivial [
  sole,
]

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Equivalent(Exps.Var("Trivial"), [Exps.Var("sole")]),
    ]),
  )
})
