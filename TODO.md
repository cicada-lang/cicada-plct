# pi

readbackNeutral -- Ap
tests/compute-ap.test.ts -- let it fail for now

making tests/compute-ap.test.ts pass

formatCore -- Pi -- fold continued `Pi` to `MultiPi`
formatCore -- Fn -- fold continued `Fn` to `MultiFn`
formatCore -- Ap -- fold continued `Ap` to `MultiAp`

readback -- Fn
readback -- Pi

Exps.FnAnnotated -- can be inferred
check -- Exps.FnAnnotated -- checkByInfer
infer -- Exps.FnAnnotated
simplifyMultiFn -- return Exps.FnAnnotated

# sigma

Exps.Car -- grammar and matcher
Exps.Cdr -- grammar and matcher

Neutrals.Car
Neutrals.Cdr

check -- Cons
infer -- Car
infer -- Cdr

evaluate -- Sigma
evaluate -- Cons
evaluate -- Car
evaluate -- Cdr

formatCore -- Sigma
formatCore -- Cons
formatCore -- Car
formatCore -- Cdr

readback -- Sigma
readback -- Cons

readbackNeutral -- Car
readbackNeutral -- Car

# trivial

# string

# clazz

define Exps.New

Exps.Clazz -- grammar and matcher
Exps.Objekt -- grammar and matcher
Exps.Dot -- grammar and matcher
Exps.New -- grammar and matcher

checkType -- Clazz
check -- Objekt
infer -- Dot

doDot

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# unification, implicit and vague

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

# recursion

fixpoint and readback
