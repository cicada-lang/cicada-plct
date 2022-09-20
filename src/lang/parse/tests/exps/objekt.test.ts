import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Objekt", () => {
  expect(parseExp("{ T: Type, x: T }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain("T", Exps.Var("Type")),
        Exps.PropertyPlain("x", Exps.Var("T")),
      ]),
    ),
  )
})

test("parse Objekt -- optional ending comma", () => {
  expect(parseExp("{ T: Type, x: T, }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain("T", Exps.Var("Type")),
        Exps.PropertyPlain("x", Exps.Var("T")),
      ]),
    ),
  )
})

test("parse Objekt -- shorthand", () => {
  expect(parseExp("{ x, y, z }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain("x", Exps.Var("x")),
        Exps.PropertyPlain("y", Exps.Var("y")),
        Exps.PropertyPlain("z", Exps.Var("z")),
      ]),
    ),
  )
})

test("parse Objekt -- shorthand -- single one", () => {
  expect(parseExp("{ x }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([Exps.PropertyPlain("x", Exps.Var("x"))]),
    ),
  )
})

test("parse Objekt -- duplicate", () => {
  expect(parseExp("{ x, x, x }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain("x", Exps.Var("x")),
        Exps.PropertyPlain("x", Exps.Var("x")),
        Exps.PropertyPlain("x", Exps.Var("x")),
      ]),
    ),
  )
})

test("parse Objekt -- method", () => {
  expect(parseExp("{ f: (x) => x }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain(
          "f",
          Exps.FnFolded([Exps.FnBindingName("x")], Exps.Var("x")),
        ),
      ]),
    ),
  )

  expect(parseExp("{ f: (x, y, z) => x }")).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain(
          "f",
          Exps.FnFolded(
            [
              Exps.FnBindingName("x"),
              Exps.FnBindingName("y"),
              Exps.FnBindingName("z"),
            ],
            Exps.Var("x"),
          ),
        ),
      ]),
    ),
  )
})
