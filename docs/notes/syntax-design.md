---
title: Syntax Design
---

# Principles

**Principle 1: Our grammar must not be ambiguous.**

**Principle 2: We do not preserve keywords.**

# No postfix semicolon, but prefix keyword

If we do not want to write semicolons in `{ ... }`,
we need to add keyword in front of to every statements.

A classical design is (learned from Scala):

```
match <exp> {
  case (<pattern>, ...) => ...
  case (<pattern>, ...) => ...
  ...
}
```

v.s.

```
match <exp> {
  (<pattern>, ...) => ...;
  (<pattern>, ...) => ...;
  ...;
}
```

Take the `equivalent` statement as another example.

We design the grammar to be:

```
equivalent <exp> [
  <exp>,
  <exp>,
  ...,
]
```

instead of:

```
equivalent <exp> {
  <exp>
  <exp>
  ...
}
```

Because the following code are ambiguous:

```
equivalent Type {
  class { A: Type, x: A }
}
```

It can mean (because we do not preserve keywords).

```
equivalent Type [
  class,
  { A: Type, x: A },
]
```

It can also mean:

```
equivalent Type [
  class { A: Type, x: A },
]
```
