# having solution all the time

infer and check take `mod` instead of `solution`

every call to `evaluate` should use `solution` enriched `env`

- `Mod` should provide API for this

should not use `TypedNeutral` as `PatternVar`

- `PatternVar` must be its own value
- fix "check Fn -- dependent error"

fix tests/solve/solve-box.test.ts

- infinite loop

eager `deepWalk` -- like the elab paper

mod cleanup solution after each stmt
