# insertImplicitAp

stmt function handle implicit fn

- pass function-with-implicit.test.ts

check-implicit-ap-insertion.test.ts -- use `function` stmt
compute-implicit-ap-insertion.test.ts -- use `function` stmt

implicit-ap-insertion -- test deepWalk

deepWalk -- note about target of deepWalk

insertImplicitAp -- `collectPatternVars` again on `Values.ImplicitPi`

[refactor] insertImplicitAp -- improve recursion structure

[maybe] fix recursion structure of `solveType` and `solve`

- Should be able to call `solveType` as API

[maybe] insertImplicitFn -- after `foldFn`

[maybe] checkByInfer -- when inferred type is ImplicitPi, handle it specially
