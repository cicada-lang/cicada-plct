import { test } from "vitest"
import { runCode } from "../utils"

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

test.todo("solve Sigma", async () => {
  await runCode(`

solve (A: Type, B: (x: A) -> Type) {
  equation exists (x: A) B(x) = exists (_: String) String : Type
  solve (x: String) {
    equation B(x) = String : Type
  }
}

// Solution:
// {
//   A: String,
//   B: (x: String) => String,
// }

`)
})
