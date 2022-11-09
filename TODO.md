bug -- `inclusionClazz` after `unifyClazz`
will call `freshenNames` again, with newly created `PatternVar` in solution,
thus will general-categorycan not use the

- pass `groupCategory.todo.cic`

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
