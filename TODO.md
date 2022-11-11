solve implicit pattern variables in place,
readback solved value, insert readbacked core.

quit using global side-effect on `mod.solution`

- passing `solution`
- still passing `mod` -- for future usage

improve error report for `groupCategory.todo.cic`

pass `groupCategory.todo.cic`

# order or orderless?

refactor `includeClazzOrdered` -- step left and right
refactor `unifyClazzOrdered` -- step left and right
rename `includeClazzOrdered` to `includeClazz`
rename `unifyClazzOrdered` to `unifyClazz`
remove `includeClazzOrderless` & `unifyClazzOrderless`
remove `freshenNames` & `clazzExpel`

[note] `alphaEquivalentClazz` current handles equivalent out of order

- [maybe] `alphaEquivalentClazz` should not handle equivalent out of order.
  because "equivalent thing can not be unified" is a bad semantic.

# syntax for equivalent

[syntax] we need a syntax -- `equivalent <type> {}` macro -- for reasoning about equality

- capture the use of `equalCompose` only

[syntax] redesign the `equivalent <type> []` syntax -- use `equivalent <type> {}` instead

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `equivalent` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now

[maybe] `unifyClazz` & `includeClazz` support reordering of properties

- should be just like `Sigma`
- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation
