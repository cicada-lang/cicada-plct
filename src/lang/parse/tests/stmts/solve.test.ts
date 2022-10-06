import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Solve", () => {
  expect(
    parseStmts(`

solve (A: Type, B: Type) {
  unify A = Trivial : Type
  unify B = String : Type
  unify A = B : Type
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
          Stmts.EquationUnifyTyped(Exps.Var("A"), Exps.Var("Trivial"), Exps.Var("Type")),
          Stmts.EquationUnifyTyped(Exps.Var("B"), Exps.Var("String"), Exps.Var("Type")),
          Stmts.EquationUnifyTyped(Exps.Var("A"), Exps.Var("B"), Exps.Var("Type")),
        ],
      ),
    ]),
  )
})

test("parse Solve -- empty bindings", () => {
  expect(
    parseStmts(`

solve () {
  unify A = Trivial : Type
  unify B = String : Type
  unify A = B : Type
}

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Solve(
        [],
        [
          Stmts.EquationUnifyTyped(Exps.Var("A"), Exps.Var("Trivial"), Exps.Var("Type")),
          Stmts.EquationUnifyTyped(Exps.Var("B"), Exps.Var("String"), Exps.Var("Type")),
          Stmts.EquationUnifyTyped(Exps.Var("A"), Exps.Var("B"), Exps.Var("Type")),
        ],
      ),
    ]),
  )
})

test("parse Solve -- untyped unify", () => {
  expect(
    parseStmts(`

solve () {
  unify A = Trivial
  unify B = String
  unify A = B : Type
}

`),
  ).toMatchObject(
    deleteUndefined([
      new Stmts.Solve(
        [],
        [
          Stmts.EquationUnify(Exps.Var("A"), Exps.Var("Trivial")),
          Stmts.EquationUnify(Exps.Var("B"), Exps.Var("String")),
          Stmts.EquationUnifyTyped(Exps.Var("A"), Exps.Var("B"), Exps.Var("Type")),
        ],
      ),
    ]),
  )
})
