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
          { name: "A", type: Exps.Var("Type") },
          { name: "B", type: Exps.Var("Type") },
        ],
        [
          {
            left: Exps.Var("A"),
            right: Exps.Var("Trivial"),
            type: Exps.Var("Type"),
          },
          {
            left: Exps.Var("B"),
            right: Exps.Var("String"),
            type: Exps.Var("Type"),
          },
          {
            left: Exps.Var("A"),
            right: Exps.Var("B"),
            type: Exps.Var("Type"),
          },
        ],
      ),
    ]),
  )
})
