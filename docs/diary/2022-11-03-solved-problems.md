---
title: Solved problems
date: 2022-11-03
---

# How to implementing lexical scope?

Use closure.

# How to derive type checking algorithm from inference rules (relations)?

Use bidirectional type checking.

To translate inference rules to type checking functions,
we do not just implement `check` or `infer`, but both.

```
check(ctx: Ctx, exp: Exp, type: Value): Void
infer(ctx: Ctx, exp: Exp): Value
```

# How to implement equivalence of lambda expressions?

Implement equivalence by normalization.

And implement normalization by evaluation + readback,
which handles eta-rules well.

A.k.a. NbE.

# How to implement implicit arguments?

Use elaboratation -- `Core` v.s. `Exp`.

We do not only use the datatype `Exp` but also `Core`.

`check` and `infer` should return an extra value -- the elaborated `Core`.

- `check` and `infer` WITHOUT `Core`:

  ```
  check(ctx: Ctx, exp: Exp, type: Value)
  infer(ctx: Ctx, exp: Exp): Value
  ```

- `check` and `infer` WITH `Core`:

  ```
  check(ctx: Ctx, exp: Exp, type: Value): Core
  infer(ctx: Ctx, exp: Exp): { type: Value, core: Core }
  ```

During the process of type checking, we can get a lot of information as by-product,
we should not waste them, we should use a extra datatype `Core` to capture them.

`Core` can be viewed as a simpler core language.

Use unification to get information from type during elaboratation.

Use _implicit application insertion_ to generate more elaborate `Core` from `Exp`.

# How to implement termination check?

Use `CallMatrix`.

A functor from dependency relations between functions,
to matrix of trileans.

| Trilean Value | Meaning                            |
| ------------- | ---------------------------------- |
| true          | decreasing                         |
| middle        | maybe decreasing after composition |
| false         | not decreasing or not comparable   |
