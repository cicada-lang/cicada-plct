import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Quote", () => {
  expect(parseExp('"abc"')).toMatchObject(deleteUndefined(Exps.Quote("abc")))
})

test("parse Quote -- empty", () => {
  expect(parseExp('""')).toMatchObject(deleteUndefined(Exps.Quote("")))
})
