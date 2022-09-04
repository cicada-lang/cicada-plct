import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Clazz", () => {
  expect(parseExp("class { T: Type, x: T }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedClazz([
        Exps.ClazzBindingAbstract("T", Exps.Var("Type")),
        Exps.ClazzBindingAbstract("x", Exps.Var("T")),
      ]),
    ),
  )

  expect(parseExp("class { T: Type = String, x: T }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedClazz([
        Exps.ClazzBindingFulfilled("T", Exps.Var("Type"), Exps.Var("String")),
        Exps.ClazzBindingAbstract("x", Exps.Var("T")),
      ]),
    ),
  )
})

test("parse Clazz -- without comma", () => {
  expect(
    parseExp(`
class {
  T: Type
  x: T
}`),
  ).toMatchObject(
    deleteUndefined(
      Exps.FoldedClazz([
        Exps.ClazzBindingAbstract("T", Exps.Var("Type")),
        Exps.ClazzBindingAbstract("x", Exps.Var("T")),
      ]),
    ),
  )

  expect(
    parseExp(`
class {
  T: Type = String
  x: T
}`),
  ).toMatchObject(
    deleteUndefined(
      Exps.FoldedClazz([
        Exps.ClazzBindingFulfilled("T", Exps.Var("Type"), Exps.Var("String")),
        Exps.ClazzBindingAbstract("x", Exps.Var("T")),
      ]),
    ),
  )
})
