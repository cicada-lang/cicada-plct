FoldedObjekt -- syntax with a list of properties

assertNoDuplicateProperties -- pass check-objekt.test.ts

check-objekt.test.ts -- test extra property -- disallowed for now

disallowExtraProperty -- pass check-objekt.test.ts

# syntax

Exps.Sequence -- syntax

Exps.Objekt -- syntax -- handle "property:method"

Exps.Clazz -- syntax -- handle "clazz_binding:method_fulfilled"

FoldedObjekt -- handle "property:spread"

# pair

Add `Pair` as a global

check-pair.test.ts

compute-pair.test.ts

# the

Add `the` as a global

check-the.test.ts

compute-the.test.ts

# new

Exps.New

Exps.New -- grammar and matcher

New -- check

New -- evaluate

New -- formatCore

# error report

> We should setup an error report framework (and test it) as soon as possible.

error for report

error report for ElaborationError

# pi

Exps.FnAnnotated -- can be inferred

check -- Exps.FnAnnotated -- checkByInfer

infer -- Exps.FnAnnotated

unfoldMultiFn -- return Exps.FnAnnotated

MultiApWithReturnType

Exps.FnWithReturnType

Exps.FnAnnotatedWithReturnType

# equal

Equal

replace

refl

same

# unification, implicit and vague

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

# datatype

Exp -- Datatype

Exp -- TypeConstructor

Exp -- DataConstructor

# recursion

fixpoint and readback

# format

> For pretty print Support.

[maybe] learn from https://prettier.io/docs/en/plugins.html

formatExp

formatStmt
