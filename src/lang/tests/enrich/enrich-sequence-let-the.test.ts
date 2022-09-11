import { test } from "vitest"
import { runCode } from "../utils"

test.todo("enrich SequenceLetThe", async () => {
  await runCode(`

class AB {
  a: String
  b: String
}

class ABC {
  a: String
  b: String
  c: String
}

check begin {
  let abc: AB = {
    a: "a",
    b: "b",
    c: "c",
  }

  check abc: ABC

  return abc
}: ABC

`)
})
