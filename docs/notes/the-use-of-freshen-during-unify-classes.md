---
title: The use of freshen during unify classes
---

Why we need `freshenNames`?

Because without it the following test will fail?

> src/lang/tests/solve/solve-dot.test.ts > solve Dot

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
