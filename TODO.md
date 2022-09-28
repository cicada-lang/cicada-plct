Stmts.Solve -- support infer if left or right can be inferred

- drop type in "solve Fn -- deepWalk"
- drop type in solve-objekt.test.ts

# [feature] deepWalk

https://github.com/cicada-lang/cicada/issues/78

**Problem:** `deepWalk` need to do partial evaluation on `Fn`

- **Solution 1:** `deepWalk` takes `type` as argument,
  NOT because of it is doing eta-expansion,
  but because of it need to do partial evaluation of `Fn`,
  thus need `argType` to construct a `TypedNeutral`.

- **Solution 2:** `Values.Fn` and `Cores.Fn` always have `argType`

deepWalk -- Fn

- "solve Fn -- deepWalk"

deepWalk -- FnImplicit

- "solve FnImplicit -- deepWalk"

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
