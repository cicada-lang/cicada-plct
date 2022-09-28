Stmts.Solve -- support infer if left or right can be inferred

- drop type in "solve Fn -- deepWalk"
- drop type in solve-objekt.test.ts

# [feature] deepWalk

https://github.com/cicada-lang/cicada/issues/78

[maybe] deepWalk should take `type` for partial evaluation of `Fn`

deepWalk -- Fn

- "solve Fn -- deepWalk"

deepWalk -- FnImplicit

deepWalk -- ClazzNull ClazzCons ClazzFulfilled

deepWalk -- TypedNeutral

# [feature] unification between two Sigmas #53

https://github.com/cicada-lang/cicada/issues/53

extract deepWalkNeutral

# format

`formatCore` -- `Sigma` -- print `Pair` if not occured

# [feature] equivalence #43

https://github.com/cicada-lang/cicada/issues/43

Equal
Replace
Refl
Same
