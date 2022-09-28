[bug] implement freeNames to fix the scope BUG of ImplicitAp insertion

- test "compute ApImplicit -- scope" -- should `LangError` -- not just `expectCodeToFail`

- https://github.com/cicada-lang/cicada/issues/72

`exp/freeNames` -- Clazz
`exp/freeNames` -- New
`exp/freeNames` -- Sequence

[feature] deepWalk

- https://github.com/cicada-lang/cicada/issues/78

- TDD -- try to write failing test that can be fixed by using deepWalk here

[feature] unification between two Sigmas #53

- https://github.com/cicada-lang/cicada/issues/53

[feature] equivalence #43

- https://github.com/cicada-lang/cicada/issues/43

- Equal
- Replace
- Refl
- Same
