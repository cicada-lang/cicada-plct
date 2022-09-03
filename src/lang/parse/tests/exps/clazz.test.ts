import { expect, test } from "vitest"
import {
  ClazzBindingAbstract,
  ClazzBindingFulfilled,
  FoldedClazz,
  Var,
} from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Clazz", () => {
  expect(parseExp("class { T: Type, x: T }")).toMatchObject(
    deleteUndefined(
      FoldedClazz([
        ClazzBindingAbstract("T", Var("Type")),
        ClazzBindingAbstract("x", Var("T")),
      ]),
    ),
  )

  expect(parseExp("class { T: Type = String, x: T }")).toMatchObject(
    deleteUndefined(
      FoldedClazz([
        ClazzBindingFulfilled("T", Var("Type"), Var("String")),
        ClazzBindingAbstract("x", Var("T")),
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
      FoldedClazz([
        ClazzBindingAbstract("T", Var("Type")),
        ClazzBindingAbstract("x", Var("T")),
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
      FoldedClazz([
        ClazzBindingFulfilled("T", Var("Type"), Var("String")),
        ClazzBindingAbstract("x", Var("T")),
      ]),
    ),
  )
})
