`inclusionClazz` improve error message

- "inclusionClazz expect subproperty to have fulfilled property: cat"

fix `inferProperties`

- `std/groupoid/trivialGroupoid.cic` -- `new Isomorphism` should work

remove `enrich` functions again -- declared type should be the saved type

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
