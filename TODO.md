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

Values.Trivial

globals.register("Trivial", ...)

check-trivial.test.ts
compute-trivial.test.ts

Values.Sole

check-sole.test.ts
compute-sole.test.ts

typeDirectedReadback -- Trivial

# string

Values.String

globals.register("String", ...)

check-string.test.ts
compute-string.test.ts

Exps.Quote
Cores.Quote
Values.Quote

check-quote.test.ts
compute-quote.test.ts

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

# pi

Exps.FnAnnotated -- can be inferred
check -- Exps.FnAnnotated -- checkByInfer
infer -- Exps.FnAnnotated
simplifyMultiFn -- return Exps.FnAnnotated

MultiApWithReturnType
Exps.FnWithReturnType
Exps.FnAnnotatedWithReturnType

# unification, implicit and vague

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

# recursion

fixpoint and readback
