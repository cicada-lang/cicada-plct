---
title: Inconsistency of fulfilling class type
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

This is an inconsistency of current design of fulfilling type.

The function application syntax is overloaded,
leading a reader to think that `C` has type
`(Type) -> Type` and `(Type, String) -> Type`.

Maybe we can solve this by "every thing is object",
and view `apply` as a special property.

# The same for datatype if we use the dot syntax

Take `List` as an example:

```cicada
datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}
```

We know we can apply `List` to get a type -- `List: (E: Type) -> Type`,
but we can also do `List.null` and `List.cons` to get its constructors.

The dot syntax is overloaded.

It seems `List` also has the following type:

```cicada
check List: class {
  null: (implicit E: Type) -> List(E) = List.null
  cons: (implicit E: Type, head: E, tail: List(E)) -> List(E) = List.cons
}
```

This is recursive and we should not really show this in the type of `List`.

Maybe we should not use dot syntax here,

```cicada
List.cons("a", List.cons("b", List.cons("c", List.null)))
```

but use something like:

```cicada
List::cons("a", List::cons("b", List::cons("c", List::null)))
```

If we do so, `::` will be a syntax for namespace,
which can be used with module system
-- importing a module as a namespace.
