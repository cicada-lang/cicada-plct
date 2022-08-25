Core -- Pi
Value -- Pi
Neutral -- Pi

Value -- NotYetValue

Core -- Sigma
Value -- Sigma
Neutral -- Sigma

# concrete syntax and test

Sigma -- grammar and matcher
Cons -- grammar and matcher
Car -- grammar and matcher
Cdr -- grammar and matcher

# stmt & mod

Stmt

Mod

# type checking

infer -- Var

type checking test

checkType -- Pi
infer -- Ap
check -- Fn

checkType -- Sigma
check -- Cons
infer -- Car
infer -- Cdr

checkType -- Cls
check -- Obj
infer -- Dot

# ctx

Ctx -- use null object pattern -- instead of a class wrap over `Map`

- CtxCons
- CtxNull

# env

Env -- use null object pattern -- instead of a class wrap over `Map`

- EnvCons
- EnvNull

# maybe

[maybe] we also need `multi-fn` & `multi-pi` to be symmetric with `multi-ap`

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# evaluation

evaluate

# subtyping

use unification instead of equal for Value

- unification v.s. algebraic subtyping (use lattice theory to handle inequality)
- [problem] should we add `Union` and `Intersection` type?

# recursion

fixpoint and readback
