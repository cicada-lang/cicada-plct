use "type": "module" in package.json

move std/ and tests/ to docs/

`cic run --watch` should not watch even first run meets error

`Stmts.Test` -- `test { ... }` and `test <description> { ... }`

- move snapshot tests to `test:cic`

[bug fix] pass equivalent-clazz.test

- `refl` will do an unification but what it should do is `equivalent`.

- "equivalent Clazz -- fail -- missing fulfilled property value"

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

- "equivalent Clazz -- fail -- missing property type",

  ```cicada
  compute equivalent Type {
      class { A: String, B: String }
    = class { A: String }
  }
  ```

[bug] macros like `equivalent` uses globals variables which might be shadowed

- Maybe we should be able to reference globals by `Exp`.

[bug fix] fix the use of `solutionAdvanceValue`

- `MetaVar` should not be special

- We should write test to show full `solutionAdvanceNeutral` is needed.

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
