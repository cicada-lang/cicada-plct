---
title: Class and self type
---

# Class is orderless

When we use `class`, the intention is that
the order of class property definitions does not matter,
but in our current implementation the order does matter.

```cicada
class Semigroup {
  Element: Type

  mul(x: Element, y: Element): Element

  mulAssociative(
    x: Element,
    y: Element,
    z: Element,
  ): Equal(
    Element,
    mul(x, mul(y, z)),
    mul(mul(x, y), z)
  )
}
```

A later property can reference previous property directly.

When evaluating a class, `Closure` is formed property by property.

This introduces problem when we want to
implement `inclusion` and `unify` for and classes.

The semantic is orderless, but the order matters so much
in the data structure that implements class.

Maybe we should change the data structure.

Maybe we can learn from self type.

# Self type

See [`cicada-lang/lambda` - `tests/nat-self.md`](https://github.com/cicada-lang/lambda/blob/master/tests/nat-self.md)

# The `self` keyword is like self type

```cicada
class Semigroup {
  Element: Type

  mul(x: self.Element, y: self.Element): self.Element

  mulAssociative(
    x: self.Element,
    y: self.Element,
    z: self.Element,
  ): Equal(
    self.Element,
    self.mul(x, self.mul(y, z)),
    self.mul(self.mul(x, y), z)
  )
}
```
