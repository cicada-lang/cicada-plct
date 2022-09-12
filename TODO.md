# Solve

Stmts.Solve -- for testing

```
solve (<name>: <type>, ...) {
  equation <lhs> = <rhs> : <type>
  equation <lhs> = <rhs> : <type>
  ...
}
```

solve-quote.test.ts

solve -- handle `PatternVar`

walk

solveByValue -- typedNeutral

solveByType

solveType

solveClazz

occurCheck

# Implicit

**Problem:**

During `check` of an `Exp` of type `ImplicitPi`,
use the information from **the given type**
to solve (typed) pattern variables in the `ImplicitPi`,
and use the `Solution` to insert `ImplicitAp` to the original `Exp`.

During `infer` of an `Ap` expression,
if the target of the `Ap` is of `ImplicitAp`,
we might `infer` **some of its arguments' type**,
use the information from these `argTypes`
to solve (typed) pattern variables in the `ImplicitPi`,
and use the `Solution` to insert `ImplicitAp` to the original `Ap`.

**Constraints:**

We should first be clear about the constraints (maybe the following).

- During `infer`, an application `f(x, y, z)` of an expression `f`
  of `ImplicitPi` type `(implicit A: Type, x: String, y: Pair(A, A), z: String) -> A`,
  must resolve all of its pattern variables in this `infer`.

  - Application can curry, as long as it resolve all pattern variables.

  - `f(x, y)` -- ok
  - `f(x)` -- not ok

- During `check`, an application `check f(x, y, z): String`
  can use return type to 1resolve pattern variables.

- During `check`, a variable expression `check id: (String) -> String`
  of `ImplicitPi` type `id: (implicit A: Type) -> (A) -> A`
  must resolve all of its pattern variables using the given type.

- The above constraints require a new constraint:

  - All pattern variables must occur at the start of the `FoldedPi`.

  If we break this constraint, we may say
  "must resolve all of its pattern variables until next `ImplicitPi`"
  instead of "must resolve all of its pattern variables".

# Equivalence

## Equal

Equal

Replace

Refl

Same

# Inductive datatype

## Datatype

Datatype

TypeConstructor

DataConstructor

## Recursion

fixpoint and readback

# Developer experience

## Error report

> We should setup an error report framework (and test it) as soon as possible.

error for report

error report for ElaborationError
