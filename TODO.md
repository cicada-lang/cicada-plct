# type checking

infer -- Var

type checking test

# pi

Exps.Fn -- take multiple bindings
Exps.Pi -- take multiple bindings

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

# stmt & mod

Stmt

Mod

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# subtyping

use unification instead of equal for Value

- unification v.s. algebraic subtyping (use lattice theory to handle inequality)
- [problem] should we add `Union` and `Intersection` type?

# recursion

fixpoint and readback
