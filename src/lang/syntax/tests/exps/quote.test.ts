import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Quote", () => {
  expect(parseExp('"abc"')).toMatchObject(deleteUndefined(Exps.Quote("abc")))
})

test("parse Quote -- empty", () => {
  expect(parseExp('""')).toMatchObject(deleteUndefined(Exps.Quote("")))
})
