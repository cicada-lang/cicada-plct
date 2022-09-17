# insertImplicitAp

fix fresh name in `solve` -- must also be fresh in `solution`

infer Ap -- insertImplicitAp

insertImplicitAp

- note is it ok to use `readback` in current `ctx`?

  - inferred `argType` are inferred in current `ctx`,
    but Values are not evaluated in current `ctx`.

deepWalk -- apply to the collected `patternVars`

[maybe] checkByInfer -- when inferred type is ImplicitPi, handle it specially
