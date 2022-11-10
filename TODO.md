top level `evaluate/`
top level `check/`
top level `infer/`
top level `readback/`

`Values.safeFormatType` & `Values.safeFormat` -- for `readback` might fail

`unifyClazzOrdered` -- require same order of properties

- quit using `freshenNames` & `clazzExpel`

pass `groupCategory.todo.cic`

[syntax] we need a syntax for reasoning about equations

- capture the use of `equalCompose` `equalMap` `equalSwap`

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `equivalent` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now

[maybe] `unifyClazz` & `includeClazz` support reordering of properties

- should be just like `Sigma`
- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation
