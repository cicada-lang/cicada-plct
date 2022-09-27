import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Solve", () => {
  expect(
    parseStmts(`

unify (A: Type, B: Type) {
  equation A = Trivial : Type
  equation B = String : Type
  equation A = B : Type
}

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Solve(
        [
          Stmts.SolveBinding("A", Exps.Var("Type")),
          Stmts.SolveBinding("B", Exps.Var("Type")),
        ],
        [
          Stmts.EquationTyped(
            Exps.Var("A"),
            Exps.Var("Trivial"),
            Exps.Var("Type"),
          ),
          Stmts.EquationTyped(
            Exps.Var("B"),
            Exps.Var("String"),
            Exps.Var("Type"),
          ),
          Stmts.EquationTyped(Exps.Var("A"), Exps.Var("B"), Exps.Var("Type")),
        ],
      ),
    ]),
  )
})

test("parse Solve -- empty bindings", () => {
  expect(
    parseStmts(`

unify () {
  equation A = Trivial : Type
  equation B = String : Type
  equation A = B : Type
}

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Solve(
        [],
        [
          Stmts.EquationTyped(
            Exps.Var("A"),
            Exps.Var("Trivial"),
            Exps.Var("Type"),
          ),
          Stmts.EquationTyped(
            Exps.Var("B"),
            Exps.Var("String"),
            Exps.Var("Type"),
          ),
          Stmts.EquationTyped(Exps.Var("A"), Exps.Var("B"), Exps.Var("Type")),
        ],
      ),
    ]),
  )
})

test("parse Solve -- untyped equation", () => {
  expect(
    parseStmts(`

unify () {
  equation A = Trivial
  equation B = String
  equation A = B : Type
}

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Solve(
        [],
        [
          Stmts.EquationUntyped(Exps.Var("A"), Exps.Var("Trivial")),
          Stmts.EquationUntyped(Exps.Var("B"), Exps.Var("String")),
          Stmts.EquationTyped(Exps.Var("A"), Exps.Var("B"), Exps.Var("Type")),
        ],
      ),
    ]),
  )
})
