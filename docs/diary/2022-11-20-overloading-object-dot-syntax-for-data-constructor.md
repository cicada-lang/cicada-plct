---
title: Overloading object dot syntax for data constructor
author: Xie Yuheng
date: 2022-11-20
---

Currently, the object dot syntax is overloaded for referencing data constructor.

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

If we do so, `::` will also be the syntax for namespace,
which can be used with module system -- for importing a module as a namespace.
