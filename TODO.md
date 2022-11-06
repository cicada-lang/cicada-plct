why we need `freshenNames`?

- why without it the following test will fail?

  src/lang/tests/solve/solve-dot.test.ts > solve Dot

[maybe] `expelClazz` should take a pair of classes

# std

`FnImplicit` insertion -- much needed in `std/category/Category.md`

pass std/boolean-lattice -- use `FnImplicit`

`Stmts.ClazzExtends` support `super` -- need `substExp`

pass std/groupoid -- need `super`

pass std/order -- need datatype

# maybe

[maybe] [mimor] reading-inference-rules.mimor

[maybe] [book] the-little-typer/99-appendix-b.md -- use whereabouts syntax

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
