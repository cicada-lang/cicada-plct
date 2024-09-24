import { expect, test } from "vitest"
import * as Exps from "../../../exp/index.js"
import { parseExp } from "../../index.js"
import { deleteUndefined } from "../utils.js"

test("parse Clazz -- JSON", () => {
  expect(parseExp('class { "Hello, World!": String }')).toMatchObject(
    deleteUndefined(
      Exps.ClazzUnfolded([
        Exps.ClazzBindingAbstract("Hello, World!", Exps.Var("String")),
      ]),
    ),
  )
})
