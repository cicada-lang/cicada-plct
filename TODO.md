# insertImplicitAp

stmt function handle implicit fn

check-implicit-ap-insertion.test.ts -- use `function` stmt
compute-implicit-ap-insertion.test.ts -- use `function` stmt

pass compute-implicit-ap-insertion.test.ts

insertImplicitAp -- `collectPatternVars` again on `Values.ImplicitPi`

deepWalk -- apply to the collected `patternVars`

[refactor] insertImplicitAp -- improve recursion structure

[maybe] fix recursion structure of `solveType` and `solve`

- Should be able to call `solveType` as API

[maybe] insertImplicitFn -- after `foldFn`
[maybe] checkByInfer -- when inferred type is ImplicitPi, handle it specially
