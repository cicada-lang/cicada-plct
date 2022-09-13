import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import * as Stmts from "../../../stmts"
import { parseStmts } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Solve", () => {
  expect(
    parseStmts(`

solve (A: Type, B: Type) {
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
          Stmts.Equation(Exps.Var("A"), Exps.Var("Trivial"), Exps.Var("Type")),
          Stmts.Equation(Exps.Var("B"), Exps.Var("String"), Exps.Var("Type")),
          Stmts.Equation(Exps.Var("A"), Exps.Var("B"), Exps.Var("Type")),
        ],
      ),
    ]),
  )
})
