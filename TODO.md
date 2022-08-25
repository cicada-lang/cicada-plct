# type checking

`check` call `infer` and `inclusion` for those who can be inferred

- for example Var

- the inferred type should be a subtype of the given type

- `inclusion` do not need `unify`

inclusion

- [question] attribute based subtyping v.s. algebraic subtyping (use lattice theory to handle inequality)

- [question] should we add `Union` and `Intersection` type?

- [question] why we can not (or should not) have un-tagged `Union` type?

test type checking
Stmts.Let
Stmts.Compute
test type checking -- with stmt

# pi

Exps.Pi -- take multiple bindings
Exps.Fn -- take multiple bindings

support annotated `Fn`

checkType -- Pi
infer -- Ap
check -- Fn

# sigma

Sigma -- grammar and matcher
Cons -- grammar and matcher
Car -- grammar and matcher
Cdr -- grammar and matcher

Exps.Sigma -- take multiple bindings

Value -- Sigma
Neutral -- Sigma

checkType -- Sigma
check -- Cons
infer -- Car
infer -- Cdr

# cls

Cls -- grammar and matcher
Obj -- grammar and matcher
Dot -- grammar and matcher

checkType -- Cls
check -- Obj
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
