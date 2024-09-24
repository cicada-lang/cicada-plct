---
title: Semigroup with intrinsic associative
---

Instead of defining `Semigroup` with `mulAssociative`.

How about using the intrinsic associative of `List`?

```cicada
import { List } from "../list/index.cic"

class Semigroup {
  Element: Type
  mul(List(Element)): Element
}
```

In which propositional equality in `mulAssociative`
is transfered the definitional equality of `List`.

# Generalization

Can we generalize this idea to `Monoid` and `Group`?

Is there a relation between
the subclass relation between structures,
and an unknown relation between inductive datatypes?

Like [Galois connection](https://en.wikipedia.org/wiki/Galois_connection)?
