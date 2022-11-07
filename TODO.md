# later

`FnImplicit` insertion -- much needed in `std/category/Category.md`

# std

pass std/boolean-lattice -- use `FnImplicit`

`Stmts.ClazzExtends` support `super` -- need `substExp`

[maybe] `class` support `self`

- we use `self` instead of `this` because of sefl-type

pass std/groupoid -- need `super`

pass std/order -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
