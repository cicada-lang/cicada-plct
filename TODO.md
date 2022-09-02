# clazz

compute-clazz.test.ts
compute-objekt.test.ts

[refactor] evaluate -- inline trivial variables

Stmts.Class

parse -- stmts/class.test.ts

define Exps.New

Exps.New -- grammar and matcher

check -- New
infer -- Dot

Values.Clazz
Neutrals.Dot

Values.Objekt
Values.Clazz
Neutrals.Dot

evaluate -- Objekt
evaluate -- New
evaluate -- Dot

formatCore -- Clazz
formatCore -- Objekt
formatCore -- New
formatCore -- Dot

check-objekt.test.ts -- test duplicated name
check-objekt.test.ts -- test extra property

doDot

# error report

> We should setup an error report framework (and test it) as soon as possible.

error for report

error report for ElaborationError

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

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

# later

Exps.Objekt -- grammar and matcher

- handle "property:method"

  - need syntax about "sequence"

Exps.Objekt -- grammar and matcher

- handle "property:spread"

Exps.Clazz -- grammar and matcher

- handle "clazz_binding:method_fulfilled"

  - need syntax about "sequence"
