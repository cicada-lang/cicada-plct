import { expect, test } from "vitest"
import {
  FnBindingName,
  FoldedFn,
  FoldedObjekt,
  PropertyPlain,
  Var,
} from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Objekt", () => {
  expect(parseExp("{ T: Type, x: T }")).toMatchObject(
    deleteUndefined(
      FoldedObjekt([
        PropertyPlain("T", Var("Type")),
        PropertyPlain("x", Var("T")),
      ]),
    ),
  )
})

test("parse Objekt -- optional ending comma", () => {
  expect(parseExp("{ T: Type, x: T, }")).toMatchObject(
    deleteUndefined(
      FoldedObjekt([
        PropertyPlain("T", Var("Type")),
        PropertyPlain("x", Var("T")),
      ]),
    ),
  )
})

test("parse Objekt -- shorthand", () => {
  expect(parseExp("{ x, y, z }")).toMatchObject(
    deleteUndefined(
      FoldedObjekt([
        PropertyPlain("x", Var("x")),
        PropertyPlain("y", Var("y")),
        PropertyPlain("z", Var("z")),
      ]),
    ),
  )
})

test("parse Objekt -- shorthand -- single one", () => {
  expect(parseExp("{ x }")).toMatchObject(
    deleteUndefined(FoldedObjekt([PropertyPlain("x", Var("x"))])),
  )
})

test("parse Objekt -- duplicate", () => {
  expect(parseExp("{ x, x, x }")).toMatchObject(
    deleteUndefined(
      FoldedObjekt([
        PropertyPlain("x", Var("x")),
        PropertyPlain("x", Var("x")),
        PropertyPlain("x", Var("x")),
      ]),
    ),
  )
})

test("parse Objekt -- method", () => {
  expect(parseExp("{ f: (x) => x }")).toMatchObject(
    deleteUndefined(
      FoldedObjekt([
        PropertyPlain("f", FoldedFn([FnBindingName("x")], Var("x"))),
      ]),
    ),
  )

  expect(parseExp("{ f: (x, y, z) => x }")).toMatchObject(
    deleteUndefined(
      FoldedObjekt([
        PropertyPlain(
          "f",
          FoldedFn(
            [FnBindingName("x"), FnBindingName("y"), FnBindingName("z")],
            Var("x"),
          ),
        ),
      ]),
    ),
  )
})
