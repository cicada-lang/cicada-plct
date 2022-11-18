[refactor] `unifyClazz` -- step left and right together

- [note] about `unifyClazz` compare with `Sigma`

[refactor] `includeClazz` -- step left and right together

extract the step of expanding the macros

`Exps.Equivalent` -- `infer` -- add `span`

[diary] `2022-11-19-using-readback-during-elaboration.md` -- Look back

[bug fix] `GroupHomomorphism.test.cic`

- see solution section in `2022-11-19-using-readback-during-elaboration.md`

  - implement `equivalent` directly instead of using `readback` and `alphaEquivalent`.

  - remove `alphaEquivalentClazz`

    - `alphaEquivalentClazz` should not handle equivalent out of order,
      because "equivalent thing can not be unified" is a bad semantic.

  - `readback` do not do eta-expansion.

- The problem is due to use of `readbackType` during `infer`
  for "FnAnnotated" and "FnImplicitAnnotated"

  - We should review all uses of `readback` during `infer` and `check`,
    but I think we can not avoid using `readback` during elaboration,
    because of implicit insertion will always use `readback`
    to return solved meta variable.

- During the following `infer`

  ```
  compute composeGroupHomomorphism(
    idGroupHomomorphism(trivialGroup),
    idGroupHomomorphism(trivialGroup),
  )
  ```

  Why `?G: Group` is expanded to:

  ```
  {
    Element: ?G.Element,
    mul: (x, y) => ?G.mul(x, y),
    mulAssociative: (x, y, z) => ?G.mulAssociative(x, y, z),
    id: ?G.id,
    idLeft: (x) => ?G.idLeft(x),
    idRight: (x) => ?G.idRight(x),
    inverse: (x) => ?G.inverse(x),
    inverseLeft: (x) => ?G.inverseLeft(x),
    inverseRight: (x) => ?G.inverseRight(x),
    div: (x, y) => ?G.mul(x, ?G.inverse(y))
  }
  ```

[bug fix] pass equivalent-clazz.test -- "equivalent Clazz -- fail -- missing fulfilled property value"

- example:

  ```
  compute equivalent Type {
      class { A: String = "abc" }
    = class { A: String }
  }

  check refl: Equal(
    Type,
    class { A: String = "abc" },
    class { A: String },
  )
  ```

[bug fix] fix the use of `solutionAdvanceValue`

- `MetaVar` should not be special

- We should write test to show full `solutionAdvanceNeutral` is needed.

[refactor] split `Actions.do*` into `Actions.try*` `Actions.neutralize*`

- to call `Actions.try*` in `solutionAdvanceValue`

# later

[later] use unified JSON ADT

[later] quit using `assertValues` for better error message

[diary] literal fulfilled class

- Maybe should not allow literal fulfilled class

- All classes must be purely abstract.

  - This will be a important limitation if imposed.
  - This influences community coding style (naming convention).

- For the semantic of fulfilling class.
  - How are the fulfilled values different from provided values?

# bug

[bug] macros like `equivalent` uses globals variables which might be shadowed

# maybe

[maybe] `unifyClazz` & `includeClazz` support reordering of properties

- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation

[maybe] print error message in XML for re-parsing them on the web

# std

[std] `group/groupCategory.todo.cic`

- need to prove `Equal` over class,
  need to learn about path type before do this.

[std] `order` -- need datatype
