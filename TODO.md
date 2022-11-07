std -- use `FnImplicit` insertion

# std

`Stmts.ClazzExtends` support `super` -- need `substExp`

[maybe] `class` support `self`

- we use `self` instead of `this` because of sefl-type

pass std/groupoid -- need `super`

pass std/order -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
