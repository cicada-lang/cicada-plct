import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils"

test("check Objekt", async () => {
  await runCode(`

check {
  a: "a",
  b: "b",
  c: "c",
}: class { a: String, b: String, c: String }

`)
})

test("check Objekt -- missing property", async () => {
  await expectCodeToFail(`

check {
  a: "a",
  b: "b",
  // c: "c",
}: class { a: String, b: String, c: String }

`)
})

test("check Objekt -- dependent", async () => {
  await runCode(`

check {
  T: String,
  x: "x",
}: class { T: Type, x: T }

`)
})

test("check Objekt -- dependent -- fail", async () => {
  await expectCodeToFail(`

check {
  T: String,
  x: Type,
}: class { T: Type, x: T }

`)
})

test("check Objekt -- check against fulfilled clazz", async () => {
  await runCode(`

check {
  T: String,
  x: Type
}: class { T: Type = String, x: Type = Type }

  `)
})

test("check Objekt -- prefilled", async () => {
  await runCode(`

check {
  a: "a",
  b: "b",
  c: "c",
}: class { a: String = "a", b: String, c: String }

`)

  await expectCodeToFail(`

check {
  a: "b",
  b: "b",
  c: "c",
}: class { a: String = "a", b: String, c: String }

`)
})

test("check Objekt -- duplicate properties", async () => {
  await expectCodeToFail(`

check {
  a: "a",
  b: "b",
  c: "c",
  a: "c",
}: class { a: String, b: String, c: String }

`)
})

test("check Objekt -- extra properties", async () => {
  await runCode(`

check {
  a: "a",
  b: "b",
  c: "c",
  x: "x",
  y: "y",
  z: (T: Type) => "z",
}: class { a: String, b: String, c: String }

`)
})

test("check Objekt -- extra properties -- fail -- can not infer", async () => {
  await expectCodeToFail(`

check {
  a: "a",
  b: "b",
  c: "c",
  x: "x",
  y: "y",
  z: (T) => "z",
}: class { a: String, b: String, c: String }

`)
})
