# Subtyping

## inclusion

Values.clazzFromTypedValues

Values.appendClazz

Allow extra property during infer `New`

test extra property for infer New

When we do a typed binding, we need to be able to refine the declared type.

- this is specially needed for `let <var>: <fulfilled class> = <object>`

- `LetThe` -- if we can `infer`, we should use the inferred type instead of the given type.

- Both `Stmts.LetThe` and Sequence `LetThe`

- [maybe] rename Exp about Sequence

- [maybe] remove Sequence from Core

fix compute-objekt.test.ts -- "compute Objekt -- extra properties"

# Implicit and Vague

> Equivalence and Datatype depend on these features.

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

unify

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
