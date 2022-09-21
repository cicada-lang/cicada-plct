# having solution all the time

fix deepWalk on Pi and Sigma

insert `ImplicitAp` during check

- pass test "compute ImplicitAp -- insertion -- during check"

fix tests/solve/solve-box.test.ts

infer and check take `mod` instead of `solution`

every call to `evaluate` should use `solution` enriched `env`

- `Mod` should provide API for this
