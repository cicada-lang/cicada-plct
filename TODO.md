Solution -- constructors

Ctx -- use null object pattern -- instead of a class wrap over `Map`

- CtxCons
- CtxNull

Env -- use null object pattern -- instead of a class wrap over `Map`

- EnvCons
- EnvNull

NotYetValue and Neutral

# concrete syntax and test

use partech

setup parser test

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# type checking

check
infer

# evaluation

evaluate

# subtyping

use unification instead of equal for Value

- unification v.s. algebraic subtyping (use lattice theory to handle inequality)
- [problem] should we add `Union` and `Intersection` type?

# recursion

fixpoint and readback
