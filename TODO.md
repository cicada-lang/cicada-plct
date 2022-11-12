quit using global side-effect on `mod.solution`

- `solutionAdvanceValue` takes `solution`
- `unify` takes `solution`
- `include` takes `solution`
- `readback` takes `solution` -- for `solutionAdvanceValue`
- still passing `mod` -- for future usage

refactor `includeClazz` -- step left and right

refactor `unifyClazz` -- step left and right

# DX

`formatCore` -- print `[rename <name>]` instead of `[rename]`

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
