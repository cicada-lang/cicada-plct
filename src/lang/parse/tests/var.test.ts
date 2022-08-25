import { expect, test } from "vitest"
import { Var } from "../../Exp"
import { parseExp } from "../index"
import { deleteUndefined } from "./utils"

test("parse Var", () => {
  expect(parseExp("x")).toMatchObject(deleteUndefined(Var("x")))
  expect(parseExp("abc")).toMatchObject(deleteUndefined(Var("abc")))
})
