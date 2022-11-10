use `assertClazzInCtx` instead of `assertClazz` as much as possible

- remove `assertValues`

pass `groupCategory.todo.cic`

[maybe] `unifyClazz` & `inclusionClazz` should do a reordering of properties,
to avoid using `freshenNames`,
making it just like `Sigma`.

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
