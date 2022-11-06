[book] the-little-typer/99-appendix-b.md -- use whereabouts syntax

[mimor] reading-inference-rules.mimor -- use whereabouts syntax

note about class and self type

fix `unifyClazz`

- should not use `freshenNames` and `expelClazz`

Why we need `freshenNames`?

- why without it the following test will fail?

  `src/lang/tests/solve/solve-dot.test.ts > solve Dot`

  ```
  class ABC {
    a: String
    b: String
    c: String
  }

  solve (abc: ABC, a: String, b: String, c: String) {
    a = abc.a
    b = abc.b
    c = abc.c
    abc = { a: "a", b: "b", c: "c" }
  }
  ```

  Because without a freshen name for `a`,
  when `a` should be a neutral variable (from class definition),
  the `a` in the scope of `solve` will be seen,
  which is bound to `abc.a`.

# later

`FnImplicit` insertion -- much needed in `std/category/Category.md`

# std

pass std/boolean-lattice -- use `FnImplicit`

`Stmts.ClazzExtends` support `super` -- need `substExp`

[maybe] `class` support `self`

- we use `self` instead of `this` because of sefl-type

pass std/groupoid -- need `super`

pass std/order -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
