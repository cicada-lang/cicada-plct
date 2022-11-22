---
title: Using readback during elaboration
author: Xie Yuheng
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

Take `FnAnnotated` as an example, we need `readback` here, because:

- the return value has `Values.Pi` as type,
- and `Values.Pi` need a closure,
- and closure need a `Core`,
- but the inferred return type is a `Value`,
- and the inferred return type is not the finial return type,
  because we get this value when context is extended by a type (no value).
- thus we need to `readback` the partially evaluated return type,
  to be evaluated in new (more concrete) context again.

# Solution

Constraints:

- we can not avoid using `readback` during elaboration,
  because implicit insertion will always use `readback`
  to return solved meta variable.

Currently `readback` has two roles:

- for partial evaluation,
- for eta-expansion.

The role of eta-expansion is needed only because
we use `readback` + `alphaEquivalent` to implement `equivalent`.

Thus we should implement `equivalent` directly,
and do not do eta-expansion in `readback`.

# Ohter use of readback during elaboration

We should review all uses of `readback` during elaboration (`infer` and `check`):

- `inferProperties`
- `inferNewArgs`

# Look back

Refactoring by observing the roles that a function plays,
and separating the roles into different functions.

OOP is all about role-playing objects,
but even if we do not use objects,
thinking in terms of role-playing functions can still help.
