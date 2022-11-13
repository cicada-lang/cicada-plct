`doDot` -- get value from target fulfilled class

[maybe] should not pass `args` to `insertDuringCheck` and `insertDuringInfer`

- This is NOT possible `solveByArgs` also calls `check`.

- During `solveByArgs`'s call to `check`,
  the `argType` might contain meta variables.

  If `check` does not take `solution` as a argument,
  it can not recognize this neutral variables as meta variables.

  - Thus `Solution` should not has `metaVars`.

    `MetaVar` should be `Values.MetaVar`,
    instead of using `TypedNeutral` over `Neutrals.Var` as `MetaVar`

    We can identify a `MetaVar` by itself (without the help of `solution`)

[maybe] back to side-effect on `mod.solution`

- Why we can not remove the use of `mod.solution` from `Compute.execute` now?

  - Is it because of inserted `core` is solved but the type is not?

- If we can not remove the use of `mod.solution` from:

  - `equivalent`
  - `insertDuringInfer`
  - `insertDuringCheck`

`mod` should not has `solution`

`Solution` should not have side-effect

refactor `includeClazz` -- step left and right

refactor `unifyClazz` -- step left and right

# DX

[maybe] print error message in XML for re-parsing them on the web

`Clazz` has optional name for debug

improve error report -- using `groupCategory.todo.cic` as test

# syntax for equivalent

[syntax] we need a syntax -- `equivalent <type> {}` macro -- for reasoning about equality

- capture the use of `equalCompose` only

[syntax] redesign the `equivalent <type> []` syntax -- use `equivalent <type> {}` instead

update `std/lattice/BooleanLattice.md`

# std

pass `groupCategory.todo.cic`

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `equivalent` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now

[maybe] `unifyClazz` & `includeClazz` support reordering of properties

- should be just like `Sigma`
- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation

[maybe] `alphaEquivalentClazz` should not handle equivalent out of order.

- because "equivalent thing can not be unified" is a bad semantic.
