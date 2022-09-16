import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Objekt -- JSON", () => {
  expect(parseExp('{ "Hello, World!": "Hi!" }')).toMatchObject(
    deleteUndefined(
      Exps.FoldedObjekt([
        Exps.PropertyPlain("Hello, World!", Exps.Quote("Hi!")),
      ]),
    ),
  )
})
