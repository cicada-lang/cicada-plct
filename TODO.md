# syntax

syntax -- "stmt:let_fn"

# pair

global from cic code -- string in js

Add `Pair` as a global

check-pair.test.ts

compute-pair.test.ts

# the

Add `the` as a global

check-the.test.ts

compute-the.test.ts

# syntax

syntax -- "property:spread"

# new

Exps.New

Exps.New -- grammar and matcher

New -- check

New -- evaluate

New -- formatCore

# inclusion

Stmts.Subtype -- for testing

inclusion -- Pi
inclusion -- Sigma
inclusion -- Clazz

# conversion

conversion for all values

# error report

> We should setup an error report framework (and test it) as soon as possible.

error for report

error report for ElaborationError

# fn annotated

Exps.FnAnnotated -- can be inferred

check -- Exps.FnAnnotated -- checkByInfer

infer -- Exps.FnAnnotated

unfoldFn -- return Exps.FnAnnotated

# FoldedFnWithReturnType

FoldedFnWithReturnType

# equal

Equal

Replace

Refl

Same

# unification, implicit and vague

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

# datatype

Datatype

TypeConstructor

DataConstructor

# recursion

fixpoint and readback

# format

> For pretty print Support.

[maybe] learn from https://prettier.io/docs/en/plugins.html

formatExp

formatStmt
