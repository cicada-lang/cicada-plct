unify(solution: Solution, ctx: Ctx, t: Value, left: Value, right: Value): Solution

Solution -- use null object pattern

Ctx -- use null object pattern -- instead of a class wrap over `Map`
Env -- use null object pattern -- instead of a class wrap over `Map`

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
