# std

`substExp` -- Fn
`substExp` -- FnAnnotated
`substExp` -- FnImplicit
`substExp` -- FnImplicitAnnotated
`substExp` -- FnUnfolded
`substExp` -- FnUnfoldedWithRetType
`substExp` -- Sigma
`substExp` -- SigmaUnfolded
`substExp` -- Cons
`substExp` -- Quote
`substExp` -- ClazzNull
`substExp` -- ClazzCons
`substExp` -- ClazzFulfilled
`substExp` -- ClazzUnfolded
`substExp` -- Objekt
`substExp` -- ObjektUnfolded
`substExp` -- New
`substExp` -- NewUnfolded
`substExp` -- NewAp
`substExp` -- Dot
`substExp` -- SequenceLet
`substExp` -- SequenceLetThe
`substExp` -- SequenceCheck
`substExp` -- SequenceUnfolded

pass std/groupoid -- need `super`

pass std/order -- need datatype

# maybe

[maybe] [optimize] implement `conversion` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now
