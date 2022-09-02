import { expect, test } from "vitest"
import { Objekt, Var } from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Objekt", () => {
  expect(parseExp("{ T: Type, x: T }")).toMatchObject(
    deleteUndefined(
      Objekt({
        T: Var("Type"),
        x: Var("T"),
      })
    )
  )
})

test("parse Objekt -- optional ending comma", () => {
  expect(parseExp("{ T: Type, x: T, }")).toMatchObject(
    deleteUndefined(
      Objekt({
        T: Var("Type"),
        x: Var("T"),
      })
    )
  )
})

test("parse Objekt -- shorthand", () => {
  expect(parseExp("{ x, y, z }")).toMatchObject(
    deleteUndefined(
      Objekt({
        x: Var("x"),
        y: Var("y"),
        z: Var("z"),
      })
    )
  )
})

test("parse Objekt -- shorthand -- single one", () => {
  expect(parseExp("{ x }")).toMatchObject(
    deleteUndefined(
      Objekt({
        x: Var("x"),
      })
    )
  )
})
