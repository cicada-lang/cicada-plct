`unifyClazz` & `inclusionClazz` require same order of properties

- quit using `freshenNames` & `expelClazz`

pass `groupCategory.todo.cic`

[maybe] `unifyClazz` & `inclusionClazz` support reordering of properties

- should be just like `Sigma`
- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
