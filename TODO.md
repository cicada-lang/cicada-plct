`checkVar` -- try `insertApImplicitStep` in a loop

- pass std/groupoid -- need `super`

[question] should fulfilled class be subtype of class?

fix catch of `UnificationError` -- for `enrich` and `checkInferred`

error report print stack trace -- for debug and bug report

# std

pass std/order -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
