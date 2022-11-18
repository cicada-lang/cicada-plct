---
title: Using readback during elaboration
date: 2022-11-19
---

# A bug about unification during implicit argument insertion

We can infer:

```cicada
compute composeGroupHomomorphism(
  implicit trivialGroup,
  implicit trivialGroup,
  implicit trivialGroup,
  idGroupHomomorphism(trivialGroup),
  idGroupHomomorphism(trivialGroup),
)
```

but can not infer:

```cicada
compute composeGroupHomomorphism(
  idGroupHomomorphism(trivialGroup),
  idGroupHomomorphism(trivialGroup),
)

// ERROR:

// [unifyType]
//   left: Trivial
//   right: ?G.Element
// [unifyType] is not implemented for the pair of type values
//   left: Trivial
//   right: ?G.Element
```

Because `?G: Group` is eta-expanded during `readback`:

```cicada
{
  Element: ?G.Element,
  mul: (x, y) => ?G.mul(x, y),
  mulAssociative: (x, y, z) => ?G.mulAssociative(x, y, z),
  id: ?G.id,
  idLeft: (x) => ?G.idLeft(x),
  idRight: (x) => ?G.idRight(x),
  inverse: (x) => ?G.inverse(x),
  inverseLeft: (x) => ?G.inverseLeft(x),
  inverseRight: (x) => ?G.inverseRight(x),
  div: (x, y) => ?G.mul(x, ?G.inverse(y))
}
```

And we can unify `?G` with `trivialGroup`,
but can not unify eta-expanded object with `trivialGroup`
(unless we implement constraint-based unification).

The `readback` happened during `infer` of `FnAnnotated` and `FnImplicitAnnotated`.

We find this cause by using nodejs inspect:

```
node --inspect-brk bin/cic.js run std/group/GroupHomomorphism.test.todo.cic --watch
```

And see the eta-expansion happened before the implicit argument insertion.

# Why FnAnnotated and FnImplicitAnnotated need readback

TODO

# Solution

TODO

# Ohter use of readback during elaboration

TODO We should review all uses of `readback` during `infer` and `check`.

But, maybe we can not avoid using `readback` during elaboration,
because of implicit insertion will always use `readback`
to return solved meta variable.
