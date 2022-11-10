bug -- `inclusionClazz` after `unifyClazz`
will call `freshenNames` again, with newly created `PatternVar` in solution,
thus will general-categorycan not use the

- pass `groupCategory.todo.cic`

**Solution 1:**

Merge `unifyType` and `inclusion` into one function,
to avoid double use of `freshenNames`.

**Solution 2:**

`unifyClazz` & `inclusionClazz` should do a reordering of properties,
to avoid using `freshenNames`,
making it just like `Sigma`.

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
