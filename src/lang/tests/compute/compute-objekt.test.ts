import { expect, test } from "vitest"
import { runCode } from "../utils"

test("compute Objekt", async () => {
  const output = await runCode(`

let ABC = class { a: String, b: String, c: String }
let abc: ABC = { a: "a", b: "b", c: "c" }
compute abc

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }: class { a: String, b: String, c: String }"',
  )
})

test("compute Objekt -- prefilled", async () => {
  const output = await runCode(`

let ABC = class { a: String, b: String = "b", c: String }
let abc: ABC = { a: "a", b: "b", c: "c" }
compute abc

`)

  expect(output).toMatchInlineSnapshot(
    '"{ a: \\"a\\", b: \\"b\\", c: \\"c\\" }: class { a: String, b: String = \\"b\\", c: String }"',
  )
})

test("compute Objekt -- extra properties", async () => {
  const output = await runCode(`

let ABC = class { a: String, b: String, c: String }
let abcxyz: ABC = { a: "a", b: "b", c: "c", x: "x", y: "y", z: "z" }
compute abcxyz

`)

  expect(output).toMatchInlineSnapshot(
    '"{ x: \\"x\\", y: \\"y\\", z: \\"z\\", a: \\"a\\", b: \\"b\\", c: \\"c\\" }: class { x: String = \\"x\\", y: String = \\"y\\", z: String = \\"z\\", a: String, b: String, c: String }"',
  )
})
