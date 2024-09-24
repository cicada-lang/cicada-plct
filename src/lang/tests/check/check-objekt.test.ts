import { test } from "vitest"
import { expectCodeToFail, runCode } from "../utils.js"

test("check Objekt", async () => {
  await runCode(`

check {
  a: "a",
  b: "b",
  c: "c",
}: class { a: String, b: String, c: String }

`)
})

test("check Objekt -- during infer Ap", async () => {
  await runCode(`

function id(T: Type, x: T): T {
  return x
}

class ABC {
  a: String
  b: String
  c: String
}

class AB {
  a: String
  b: String
}

let a = "a"
let b = "b"
let c = "c"

check id(AB, { a, b }): AB
check id(ABC, { a, b, c }): ABC

`)
})

test("check Objekt -- during infer Ap -- fail", async () => {
  await expectCodeToFail(`

function id(T: Type, x: T): T {
  return x
}

class ABC {
  a: String
  b: String
  c: String
}

let a = "a"
let b = "b"
let c = "c"

check id(ABC, { a, b }): ABC

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

test("check Objekt -- extra properties -- ignore what can not infer", async () => {
  await runCode(`

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
