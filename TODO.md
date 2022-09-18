[refactor] fix recursion structure of `solveType` and `solve`

- Should be able to call `solveType` as API

deepWalk

Stmts.Solve -- use `deepWalk`

# insertImplicitAp

insertImplicitAp -- use `deepWalk`

- note about target of deepWalk

insertImplicitAp -- `collectPatternVars` again on `Values.ImplicitPi`

[maybe] checkByInfer -- when inferred type is ImplicitPi, handle it specially

# insertImplicitFn

[maybe] insertImplicitFn -- after `foldFn`
