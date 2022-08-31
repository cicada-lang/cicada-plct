import { expect, test } from "vitest"
import { Quote } from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Quote", () => {
  expect(parseExp('"abc"')).toMatchObject(deleteUndefined(Quote("abc")))
})

test("parse Quote -- empty", () => {
  expect(parseExp('""')).toMatchObject(deleteUndefined(Quote("")))
})
