`Stmts.LetThe` -- call `enrich`

- TODO test

call enrich during `checkProperties`

- check-sequence.test.ts -- "check Sequence -- LetThe and enrich -- nested Objekt"

compute-objekt.test.ts -- "compute Objekt -- extra properties"

# Syntax

## FoldedFnWithReturnType

FoldedFnWithReturnType

function expression can have return type

function stmt can drop return type and let it infer

# Implicit and Vague

> Equivalence and Datatype depend on these features.

[maybe] we should just use `Ctx` as `Solution`

- if we do so, how should we handle `SolutionFailure`?

predicates/isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

unify

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
