# Subtyping

## New

NewNameless

## fulfilling type

doAp -- Clazz

## conversion

conversion-clazz.test.ts

- let us try to implement a version where the order does not matters

conversionType Clazz

- pass conversion-clazz.test.ts

conversionByType Pi

- pass conversion-fn.test.ts

conversionByType Sigma

- pass conversion-cons.test.ts

conversionByType Clazz

- pass conversion-objekt.test.ts

## inclusion

inclusion -- Pi

- inclusion-pi.test.ts

inclusion -- Sigma

- inclusion-sigma.test.ts

inclusion -- Clazz

- inclusion-clazz.test.ts

# Equivalence

## Equal

Equal

Replace

Refl

Same

# Syntax

## Objekt and New

syntax -- "property:spread"

## FnAnnotated

Exps.FnAnnotated -- can be inferred

check -- Exps.FnAnnotated -- checkByInfer

infer -- Exps.FnAnnotated

unfoldFn -- return Exps.FnAnnotated

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
