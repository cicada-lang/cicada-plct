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
}

`),
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
}

`),
  ).toMatchObject(
    deleteUndefined(
      Exps.FoldedClazz([
        Exps.ClazzBindingFulfilled("T", Exps.Var("Type"), Exps.Var("String")),
        Exps.ClazzBindingAbstract("x", Exps.Var("T")),
      ]),
    ),
  )
})

test("parse Clazz -- function", () => {
  expect(
    parseExp(`

class {
  id(T: Type, x: T): T {
    return x
  }
}

`),
  ).toMatchObject(
    deleteUndefined(
      Exps.FoldedClazz([
        Exps.ClazzBindingFulfilled(
          "id",
          Exps.PiFolded(
            [
              Exps.PiBindingNamed("T", Exps.Var("Type")),
              Exps.PiBindingNamed("x", Exps.Var("T")),
            ],
            Exps.Var("T"),
          ),
          Exps.FoldedFn(
            [Exps.FnBindingName("T"), Exps.FnBindingName("x")],
            Exps.FoldedSequence([], Exps.Var("x")),
          ),
        ),
      ]),
    ),
  )
})
