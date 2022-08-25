import { expect, test } from "vitest"
import { parseExp } from "../index"
import { Var } from "../../Exp"
import { deleteUndefined } from "./utils"

test("parse var", () => {
  expect(parseExp("x")).toMatchObject(deleteUndefined(Var("x")))
  expect(parseExp("abc")).toMatchObject(deleteUndefined(Var("abc")))
})
