construct new Exp with span -- foldSequence.ts
construct new Exp with span -- foldSigma.ts

# std

pass std/category/initial-and-terminal-objects.md

- Why `dom` occurred?
  Why it has not been evaluated to the fulfilled `x.object` already?

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
