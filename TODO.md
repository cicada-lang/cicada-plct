# Solve

rename unify to solve

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

```
solve (A: Type, B: (x: A) -> Type) {
  equation exists (x: A) B(x) = exists (_: String) String : Type
}

solve (x: String) {
  equation B(x) = String : Type
}

// solution

{
  A: String,
  B: (x: String) => String,
}
```

# Implicit

We should first be clear about the constraints.

Maybe we should have the following constraints:

- `FoldedAp` of expression of `ImplicitPi` type
  must resolve all of its pattern variables.

  - During `infer` or `check`.
  - `FoldedAp` can curry, as long as it resolve all pattern variables.

- During `check`, expression of `ImplicitPi` type
  must resolve all of its pattern variables.

- All pattern variables must occur at the start of the `FoldedPi`.

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
