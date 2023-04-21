---
title: Different forms of judgments
author: Xie Yuheng
date: 2023-04-22
---

When we talk about different forms of judgments,
there is really only one form of judgment: `Exp: Type`.

All other judgments are direct implementations of special `Exp: Type`.

When design the structure `Exp` and `Type`,

- First, the design must express mathematical structure.

- Second, we must have efficient algorithm to check the judgment `Exp: Type`.

Thus, inference rules muse be algorithm for type checking,
but not only logic programming clauses that specifies type checking,
which may not imply efficient algorithm.
Because a type system is not very useful, if it does not have
a useful to not have efficient type checking algorithm.

Then all the complexities come from the `Equal` type constructor.
