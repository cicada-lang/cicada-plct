import { expect, test } from "vitest"
import { runCode } from "../utils"

test("solve Sigma", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation Pair(A, B) = Pair(String, String)
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Sigma -- nested", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation Pair(A, Pair(String, B)) = Pair(String, Pair(String, String))
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

test("solve Sigma -- occur twice", async () => {
  const output = await runCode(`

solve (A: Type, B: Type) {
  equation Pair(A, Pair(B, B)) = Pair(String, Pair(String, String))
}

`)

  expect(output).toMatchInlineSnapshot('"{ A: String, B: String }"')
})

/**

   The following test comes from `my_car` and `my_cdr`:

   ```cicada
   function my_car(
     implicit A: Type,
     implicit B: (x: A) -> Type,
     pair: exists (x: A) B(x)
   ): A {
     return car(pair)
   }

   function my_cdr(
     implicit A: Type,
     implicit B: (x: A) -> Type,
     pair: exists (x: A) B(x),
   ): B(car(pair)) {
     return cdr(pair)
   }
   ```

**/

test.todo("solve Sigma -- generate const function", async () => {
  await runCode(`

solve (A: Type, B: (x: A) -> Type) {
  equation exists (x: A) B(x) = exists (_: String) String
}

// solve (x: String) {
//   equation B(x) = String : Type
// }

// Solution:
// {
//   A: String,
//   B: (x: String) => String,
// }

`)
})
