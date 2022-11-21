[bug fix] `GroupHomomorphism.test.cic`

- implement `equivalent` directly -- instead of using `readback` and `alphaEquivalent`.

- `readback` do not do eta-expansion.

- remove `alphaEquivalentClazz`

  - `alphaEquivalentClazz` should not handle equivalent out of order,
    because "equivalent thing can not be unified" is a bad semantic.

[diary] `2022-11-19-using-readback-during-elaboration.md` -- Look back

[bug fix] pass equivalent-clazz.test -- "equivalent Clazz -- fail -- missing fulfilled property value"

- `refl` will do an unification but what it should do is `equivalent`.

- example:

  ```cicada
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

[bug fix] `groupCategory.todo.cic`

```cicada
// TODO Wrong error:
// - EvaluationError: [evaluate] undefined variable name: x

idLeft: (f) => {
  let G = f.dom
  let H = f.cod

  let motive = Equal(
    GroupHomomorphism(G, H),
    composeGroupHomomorphism(idGroupHomomorphism(G), f),
    f,
  )

  return the(motive, refl)
},
```

# syntax

remove `function` keyword
[maybe] remove `let` keyword
[maybe] remove `return` keyword

# bug

[bug] macros like `equivalent` uses globals variables which might be shadowed

- Maybe we should be able to reference globals by `Exp`.

# maybe

[maybe] use unified JSON ADT -- change `CamelCase` to `camelCase`

[maybe] `unifyClazz` & `includeClazz` support reordering of properties

- check dependency and evaluate to a version of `ClazzCons` without closure
  - not only syntax dependency but real dependency -- need `readback` for partial evaluation

[maybe] print error message in XML for re-parsing them on the web

# std

[std] `group/groupCategory.todo.cic`

- need to prove `Equal` over class,
  need to learn about path type before do this.

[std] `order` -- need datatype
