import { expect, test } from "vitest"
import { FnBindingAnnotated, FnBindingName, MultiFn, Var } from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Fn", () => {
  expect(parseExp("(x) => x")).toMatchObject(
    deleteUndefined(MultiFn([FnBindingName("x")], Var("x")))
  )

  expect(parseExp("function (x) x")).toMatchObject(
    deleteUndefined(MultiFn([FnBindingName("x")], Var("x")))
  )
})

test("parse Fn -- multiple bindings", () => {
  expect(parseExp("(x, y) => x")).toMatchObject(
    deleteUndefined(MultiFn([FnBindingName("x"), FnBindingName("y")], Var("x")))
  )

  expect(parseExp("function (x, y) x")).toMatchObject(
    deleteUndefined(MultiFn([FnBindingName("x"), FnBindingName("y")], Var("x")))
  )
})

test("parse Fn -- annotated", () => {
  expect(parseExp("(x: Type, y: Type) => x")).toMatchObject(
    deleteUndefined(
      MultiFn(
        [
          FnBindingAnnotated("x", Var("Type")),
          FnBindingAnnotated("y", Var("Type")),
        ],
        Var("x")
      )
    )
  )

  expect(parseExp("(x: Type, y) => x")).toMatchObject(
    deleteUndefined(
      MultiFn(
        [FnBindingAnnotated("x", Var("Type")), FnBindingName("y")],
        Var("x")
      )
    )
  )
})
