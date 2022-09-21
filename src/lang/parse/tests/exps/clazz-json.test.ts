import { expect, test } from "vitest"
import * as Exps from "../../../exp"
import { parseExp } from "../../index"
import { deleteUndefined } from "../utils"

test("parse Clazz -- JSON", () => {
  expect(parseExp('class { "Hello, World!": String }')).toMatchObject(
    deleteUndefined(
      Exps.ClazzFolded([
        Exps.ClazzBindingAbstract("Hello, World!", Exps.Var("String")),
      ]),
    ),
  )
})
