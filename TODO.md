# std

`substExp` -- ClazzCons
`substExp` -- ClazzFulfilled

`substExp` -- Objekt
`substExp` -- ObjektUnfolded

`substExp` -- New
`substExp` -- NewUnfolded
`substExp` -- NewAp

`substExp` -- SequenceLet
`substExp` -- SequenceLetThe

pass std/groupoid -- need `super`

pass std/order -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
