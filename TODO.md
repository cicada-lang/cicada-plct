# std

improve `unify` error message -- use `readback` -- trace the values in `UnificationError`
improve `unifyByValue` error message -- trace the values in `UnificationError`

`FnImplicit` insertion -- much needed in `std/category/Category.md`

pass std/boolean-lattice -- use `FnImplicit`

pass std/groupoid -- need `super`

pass std/order -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- according to the flamegraph, `readback` is not the bottleneck for now
  [maybe] [mimor] reading-inference-rules.mimor
  [maybe] [book] the-little-typer/99-appendix-b.md -- use whereabouts syntax
  [maybe] `Stmts.ClazzExtends` support `super` -- need `substExp`
