---
title: Overloading function application syntax for fulfilling class
author: Xie Yuheng
date: 2021-11-11
---

We can apply a class like it is a function.

Take `C` as an example:

```cicada
class C { T: Type, x: String }
```

`C` is `Type`:

```cicada
check C: Type
```

But we can also use `C` as a `(Type) -> Type`:

```cicada
check C(String): Type
```

And we can also use `C` as a `(Type, String) -> Type`:

```cicada
check C(String, "a"): Type
```

The function application syntax is overloaded,
leading a reader to think that `C` has type
`(Type) -> Type` and `(Type, String) -> Type`.

Actions:

1. Maybe we should design new syntax for fulfilling class.

2. Maybe we can not avoid this overloading,
   because writing function application for fulfilling class is very pleasing.

3. Maybe we can solve this by "every thing is object",
   and view `apply` as a special property.
