# pi

evaluate -- Ap

Exps.FnAnnotated -- can be inferred
check -- Exps.FnAnnotated -- checkByInfer
infer -- Exps.FnAnnotated
simplifyMultiFn -- return Exps.FnAnnotated

# statements and testing

Stmts.Compute -- grammar & matcher

- need `readback`
- need `formatCore`

# sigma

Exps.Cons -- grammar and matcher
Exps.Car -- grammar and matcher
Exps.Cdr -- grammar and matcher

Value -- Sigma
Neutral -- Sigma

check -- Cons
infer -- Car
infer -- Cdr

evaluate -- Sigma
evaluate -- Cons
evaluate -- Car
evaluate -- Cdr

# trivial

# String

# clazz

define Exps.New

Exps.Clazz -- grammar and matcher
Exps.Objekt -- grammar and matcher
Exps.Dot -- grammar and matcher
Exps.New -- grammar and matcher

checkType -- Clazz
check -- Objekt
infer -- Dot

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
