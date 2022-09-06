---
title: Syntax Design
---

# Principles

**Principle 1: Our grammar must not be ambiguous.**

**Principle 2: We do not preserve keywords.**

# No postfix semicolon, but prefix keyword

If we do not want to write semicolons in `{ ... }`,
we need to add keyword in front of to every stmts (statements).

Take the `conversion` stmt as an example.

We design the grammar to be:

```
conversion <exp> [
  <exp>,
  <exp>,
  ...,
]
```

instead of:

```
conversion <exp> {
  <exp>
  <exp>
  ...
}
```

Because the following code are ambiguous:

```
conversion Type {
  class { A: Type, x: A }
}
```

It can mean (because we do not preserve keywords).

```
conversion Type [
  class,
  { A: Type, x: A },
]
```

It can also mean:

```
conversion Type [
  class { A: Type, x: A },
]
```
