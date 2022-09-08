# Subtyping

## inclusion

Allow extra property during check `Objekt` and infer `New`

- write notes about this in the code.

- `infer` the properties that are extra, thus not checked.

- We choose the inferred type as the final type, but not the given type,
  because it is more specific.

When we do a typed binding, we need to be able to refine the declared type.

- this is specially needed for `let <var>: <fulfilled class> = <object>`

- `LetThe` -- if we can `infer`, we should use the inferred type instead of the given type.

- Both `Stmts.LetThe` and Sequence `LetThe`

- [maybe] rename Exp about Sequence
- [maybe] remove Sequence from Core

# Equivalence

## Equal

Equal

Replace

Refl

Same

# Syntax

## Objekt

Objekt -- syntax -- "property:spread"

## FoldedFnWithReturnType

FoldedFnWithReturnType

# Inductive datatype

## implicit Pi and vague Pi

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

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
