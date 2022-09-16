import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Fn", () => {
  expect(parseExp("(x) => x")).toMatchObject(
    deleteUndefined(Exps.FoldedFn([Exps.FnBindingName("x")], Exps.Var("x"))),
  )

  expect(parseExp("function (x) x")).toMatchObject(
    deleteUndefined(Exps.FoldedFn([Exps.FnBindingName("x")], Exps.Var("x"))),
  )
})

test("parse Fn -- multiple bindings", () => {
  expect(parseExp("(x, y) => x")).toMatchObject(
    deleteUndefined(
      Exps.FoldedFn(
        [Exps.FnBindingName("x"), Exps.FnBindingName("y")],
        Exps.Var("x"),
      ),
    ),
  )

  expect(parseExp("function (x, y) x")).toMatchObject(
    deleteUndefined(
      Exps.FoldedFn(
        [Exps.FnBindingName("x"), Exps.FnBindingName("y")],
        Exps.Var("x"),
      ),
    ),
  )
})

test("parse Fn -- annotated", () => {
  expect(parseExp("(x: Type, y: Type) => x")).toMatchObject(
    deleteUndefined(
      Exps.FoldedFn(
        [
          Exps.FnBindingAnnotated("x", Exps.Var("Type")),
          Exps.FnBindingAnnotated("y", Exps.Var("Type")),
        ],
        Exps.Var("x"),
      ),
    ),
  )

  expect(parseExp("(x: Type, y) => x")).toMatchObject(
    deleteUndefined(
      Exps.FoldedFn(
        [
          Exps.FnBindingAnnotated("x", Exps.Var("Type")),
          Exps.FnBindingName("y"),
        ],
        Exps.Var("x"),
      ),
    ),
  )
})

test("parse Fn -- implicit", () => {
  expect(parseExp("(implicit x: Type) => x")).toMatchObject(
    deleteUndefined(
      Exps.FoldedFn(
        [Exps.FnBindingImplicit("x", Exps.Var("Type"))],
        Exps.Var("x"),
      ),
    ),
  )

  expect(parseExp("function (implicit T: Type, y: T) T")).toMatchObject(
    deleteUndefined(
      Exps.FoldedFn(
        [
          Exps.FnBindingImplicit("T", Exps.Var("Type")),
          Exps.FnBindingAnnotated("y", Exps.Var("T")),
        ],
        Exps.Var("T"),
      ),
    ),
  )
})

test("parse Fn -- with return type", () => {
  expect(parseExp("function (x: String): String x")).toMatchObject(
    deleteUndefined(
      Exps.FoldedFnWithRetType(
        [Exps.FnBindingAnnotated("x", Exps.Var("String"))],
        Exps.Var("String"),
        Exps.Var("x"),
      ),
    ),
  )
})
