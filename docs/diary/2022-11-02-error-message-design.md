---
title: Error message design
date: 2022-11-02
---

"The Little Typer" can be used as a guide for error message design.

`infer` error is described as "exp is not described by a type", for example:

```
What is the value of
  (first-of-one Atom vecnil)?

That question is meaningless because
  (first-of-one Atom vecnil)
is not described by a type, and this is
because
  vecnil
is not a
  (Vec Atom 1).
```
