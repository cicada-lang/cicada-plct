# clazz

[refactor] reorder sum types -- null at the first -- Exp, Core
[refactor] reorder sum types -- null at the first -- Value

assertValues -- first used in doDot
Dot -- doDot

compute-clazz.test.ts
Clazz -- formatCore

Objekt -- evaluate
Objekt -- formatCore
compute-objekt.test.ts

check-objekt.test.ts -- test duplicated name
check-objekt.test.ts -- test extra property -- disallowed for now

Dot -- infer
Dot -- formatCore

Exps.New
Exps.New -- grammar and matcher
New -- check
New -- evaluate
New -- formatCore

# syntax

syntax about "sequence"

Exps.Objekt -- syntax -- handle "property:method"
Exps.Clazz -- syntax -- handle "clazz_binding:method_fulfilled"
Exps.Objekt -- syntax -- handle "property:spread"

# error report

> We should setup an error report framework (and test it) as soon as possible.

error for report

error report for ElaborationError

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# sigma

Add Pair as a global

# pi

Exps.FnAnnotated -- can be inferred
check -- Exps.FnAnnotated -- checkByInfer
infer -- Exps.FnAnnotated
unfoldMultiFn -- return Exps.FnAnnotated

MultiApWithReturnType
Exps.FnWithReturnType
Exps.FnAnnotatedWithReturnType

# unification, implicit and vague

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

# recursion

fixpoint and readback
