# Solve

extract `solveByType` & `solveByValue` from `solve`

solveType

solveClazz

Stmts.Solve -- for testing

```
solve (<name>: <type>, ...) {
  equation <lhs> = <rhs> : <type>
  equation <lhs> = <rhs> : <type>
  ...
}
```

# Implicit

We should first be clear about the constraints.

Maybe we should have the following constraints:

- During `infer`, an application `f(x, y, z)` of an expression `f`
  of `ImplicitPi` type `(implicit A: Type, x: String, y: Pair(A, A), z: String) -> A`,
  must resolve all of its pattern variables in this `infer`.

  - Application can curry, as long as it resolve all pattern variables.

  - `f(x, y)` -- ok
  - `f(x)` -- not ok

- During `check`, an application `check f(x, y, z): String`
  can use given return type to 1resolve pattern variables.

- During `check`, a variable expression `check id: (String) -> String`
  of `ImplicitPi` type `id: (implicit A: Type) -> (A) -> A`
  must resolve all of its pattern variables using the given return type.

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
