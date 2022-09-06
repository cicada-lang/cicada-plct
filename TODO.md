# Subtyping

## New

NewNameless

## fulfilling type

doAp -- Clazz

## conversion

conversionType Sigma

- conversion-sigma.test.ts

conversionType Clazz

- conversion-clazz.test.ts

conversionByType Pi

- conversion-fn.test.ts

conversionByType Sigma

- conversion-cons.test.ts

conversionByType Clazz

- conversion-objekt.test.ts

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

## Standard formatter

> For pretty print Support.

[maybe] learn from https://prettier.io/docs/en/plugins.html

formatExp

formatStmt

## Error report

> We should setup an error report framework (and test it) as soon as possible.

error for report

error report for ElaborationError
