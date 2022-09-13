import { expect, test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("compute Objekt", async () => {
  const output = await runCode(`

let ABC = class { a: String, b: String, c: String }
let abc: ABC = { a: "a", b: "b", c: "c" }
compute abc

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }: class { a: String = \\"a\\", b: String = \\"b\\", c: String = \\"c\\" }"',
  )
})

test("compute Objekt -- prefilled", async () => {
  const output = await runCode(`

let ABC = class { a: String, b: String = "b", c: String }
let abc: ABC = { a: "a", b: "b", c: "c" }
compute abc

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }: class { a: String = \\"a\\", b: String = \\"b\\", c: String = \\"c\\" }"',
  )
})

test("compute Objekt -- extra properties", async () => {
  const output = await runCode(`

let ABC = class { a: String, b: String, c: String }
let abcxyz: ABC = { a: "a", b: "b", c: "c", x: "x", y: "y", z: "z" }
compute abcxyz

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\", x: \\"x\\", y: \\"y\\", z: \\"z\\" }: class { a: String = \\"a\\", b: String = \\"b\\", c: String = \\"c\\", x: String = \\"x\\", y: String = \\"y\\", z: String = \\"z\\" }"',
  )
})

test("compute Objket -- direct", async () => {
  const output = await runCode(`

compute { a: "c", b: "d" }

  `)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"c\\", b: \\"d\\" }: class { a: String = \\"c\\", b: String = \\"d\\" }"',
  )
})

test("compute Objekt -- reject", async () => {
  await runCode(`

check { T: String, x: Type }: class { T: Type = String, x: Type = Type }

  `)

  await expectCodeToFail(`

check class { T: Type = String, x: Type = Type }: class { T: Type, x: T }

  `)

  await expectCodeToFail(`

check { T: String, x: Type }: class { T: Type, x: T }

  `)
})
