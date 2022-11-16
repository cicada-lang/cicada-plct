[note] about the use of `extractApTarget` during `unifyClosure`

[refactor] `includeClazz` -- step left and right together

[refactor] `unifyClazz` -- step left and right together

# syntax for equivalent

[syntax] we need a syntax -- `equivalent <type> {}` macro -- for reasoning about equality

- capture the use of `equalCompose` only

[syntax] redesign the `equivalent <type> []` syntax -- use `equivalent <type> {}` instead

update `std/boolean-lattice/*`

# later

[maybe] should not allow literal fulfilled class

- All classes must be purely abstract.
  - This will be a important limitation if imposed.
  - This influences community coding style (naming convention).
- For the semantic of fulfilling class.
  - How are the fulfilled values different from provided values?

# std

pass `groupCategory.todo.cic`

# std

`std/order` -- need datatype

# maybe

[maybe] quit using `assertValues` for better error message

[maybe] [optimize] implement `equivalent` directly instead of using `readback` and `alphaEquivalent`

- maybe not, because according to the flamegraph, `readback` is not the bottleneck for now

[maybe] `unifyClazz` & `includeClazz` support reordering of properties

- should be just like `Sigma`
- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation

[maybe] `alphaEquivalentClazz` should not handle equivalent out of order.

- because "equivalent thing can not be unified" is a bad semantic.

[maybe] print error message in XML for re-parsing them on the web
