# data

check(ctx: Ctx, exp: Exp, t: Value): Core
infer(ctx: Ctx, exp: Exp): { t: Value, core: Core }

evaluate(env: Env, core: Core): Value

cover(ctx: Ctx, s: Value, t: Value): Solution

NotYetValue and Neutral

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

Core
Value
Ctx
Env

# type checking

check
infer

# evaluation

evaluate

# subtyping

Solution

cover

use unification instead of equal for Value

- unification v.s. algebraic subtyping (use lattice theory to handle inequality)
- [problem] should we add `Union` and `Intersection` type?

# recursion

fixpoint and readback
