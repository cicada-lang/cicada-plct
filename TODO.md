# concrete syntax and test

use partech

setup parser test

# type checking

infer -- Var

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

type checking test

# ctx

Ctx -- use null object pattern -- instead of a class wrap over `Map`

- CtxCons
- CtxNull

# env

Env -- use null object pattern -- instead of a class wrap over `Map`

- EnvCons
- EnvNull

# value

NotYetValue and Neutral

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
