extract `clazzEvaluate`

quit using `assertClazzInCtx`

maybe quit using `assertValues`

`MetaVar` should be `Values.MetaVar`

- instead of using `TypedNeutral` over `Neutrals.Var` as `MetaVar`

- `Solution` should not has `metaVars`.

- We can identify a `MetaVar` by itself (without the help of `solution`)

[refactor] `includeClazz` -- step left and right together

[refactor] `unifyClazz` -- step left and right together

[bug] readback fail during formating

- test with:

  ```
  cic run std/group/groupCategory.todo.cic --watch
  ```

  where

  ```
  idLeft: (f) => refl,
  ```

[maybe] should not allow literal fulfilled class

- all classes must be purely abstract
- for the semantic of fulfilling class

# DX

[maybe] print error message in XML for re-parsing them on the web

improve error report -- using `groupCategory.todo.cic` as test

# syntax for equivalent

[syntax] we need a syntax -- `equivalent <type> {}` macro -- for reasoning about equality

- capture the use of `equalCompose` only

[syntax] redesign the `equivalent <type> []` syntax -- use `equivalent <type> {}` instead

update `std/boolean-lattice/BooleanLattice.md`

# std

pass `groupCategory.todo.cic`

# std

`std/order` -- need datatype

# maybe

[maybe] [optimize] implement `equivalent` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now

[maybe] `unifyClazz` & `includeClazz` support reordering of properties

- should be just like `Sigma`
- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation

[maybe] `alphaEquivalentClazz` should not handle equivalent out of order.

- because "equivalent thing can not be unified" is a bad semantic.
