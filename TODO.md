improve error report for `groupCategory.todo.cic`

remove `freshenNames` & `clazzExpel`

refactor `includeClazzOrdered`

refactor `unifyClazzOrdered`

rename `includeClazzOrdered` to `includeClazz`

rename `unifyClazzOrdered` to `unifyClazz`

[syntax] we need a syntax -- `equivalent <type> {}` macro -- for reasoning about equality

- capture the use of `equalCompose` only

[syntax] redesign the `equivalent <type> []` syntax -- use `equivalent <type> {}` instead

pass `groupCategory.todo.cic`

quit using global side-effect on `mod.solution`

[note] `alphaEquivalentClazz` current handles equivalent out of order

- [maybe] `alphaEquivalentClazz` should not handle equivalent out of order.

  because "equivalent thing can not be unified" is a bad semantic.

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `equivalent` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now

[maybe] `unifyClazz` & `includeClazz` support reordering of properties

- should be just like `Sigma`
- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation
