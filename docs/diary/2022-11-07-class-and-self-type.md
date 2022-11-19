---
title: Class and self type
author: Xie Yuheng
date: 2022-11-07
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
implement `include` and `unify` for and classes.

The semantic is orderless, but the order matters so much
in the data structure that implements class.

Maybe we should change the data structure.

Maybe we can learn from self type.

Actually it is hard for us to support self type.
Because during checking of a self type,
we need to add the `target` of `self (target) ...` into the type context,
thus we need to get `target`'s type value,
but we can not get the value before checking it
(which will elaborate `Exp` to `Core` ).

# Self type

See [`cicada-lang/lambda` - `tests/nat-self.md`](https://github.com/cicada-lang/lambda/blob/master/tests/nat-self.md)

# The `this` keyword is like self type

```cicada
class Semigroup {
  Element: Type

  mul(x: this.Element, y: this.Element): this.Element

  mulAssociative(
    x: this.Element,
    y: this.Element,
    z: this.Element,
  ): Equal(
    this.Element,
    this.mul(x, this.mul(y, z)),
    this.mul(this.mul(x, y), z)
  )
}
```
