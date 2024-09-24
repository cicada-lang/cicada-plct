import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Objekt -- JSON", () => {
  expect(parseExp('{ "Hello, World!": "Hi!" }')).toMatchObject(
    deleteUndefined(
      Exps.ObjektUnfolded([
        Exps.PropertyPlain("Hello, World!", Exps.Quote("Hi!")),
      ]),
    ),
  )
})
