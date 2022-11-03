---
title: Solved problems
---

# How to implementing lexical scope?

Use closure.

# How to derive type checking algorithm from inference rules (relations)?

Use bidirectional type checking.

Using both `check` and `infer`.

```
check: (Ctx, Exp, Value) -> Void
infer: (Ctx, Exp) -> Value
```

# How to implement equivalence of lambda expressions?

Implement equivalence by normalization.

And implement normalization by evaluation + readback,
which handles eta-rules well.

A.k.a. NbE.

# How to implement implicit arguments?

Use elaboratation -- `Core` v.s. `Exp`.

- `check` and `infer` should return extra `Core`.
- Use unification to get information from type during elaboratation.
- Use implicit application insertion to generate more elaborate `Core` from `Exp`.

# How to implement termination check?

Use `CallMatrix`.

A functor from dependency relations between functions,
to matrix of trileans.

| Trilean Value | Meaning                            |
| ------------- | ---------------------------------- |
| true          | decreasing                         |
| middle        | maybe decreasing after composition |
| false         | not decreasing or not comparable   |
