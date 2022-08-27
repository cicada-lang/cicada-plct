# pi

infer -- Ap

evaluate -- Ap

Exps.FnAnnotated -- can be inferred
check -- Exps.FnAnnotated -- checkByInfer
infer -- Exps.FnAnnotated
simplifyMultiFn -- return Exps.FnAnnotated

# statements and testing

Stmts.Compute -- grammar & matcher

- need `readback`
- need `formatCore`

# sigma

Exps.Sigma -- take multiple typings

- with `bindings: Array<SigmaBinding>`

Exps.Sigma -- grammar and matcher
Exps.Cons -- grammar and matcher
Exps.Car -- grammar and matcher
Exps.Cdr -- grammar and matcher

Value -- Sigma
Neutral -- Sigma

infer -- Sigma -- to Type
check -- Cons
infer -- Car
infer -- Cdr

evaluate -- Sigma
evaluate -- Cons
evaluate -- Car
evaluate -- Cdr

# trivial

# String

# clazz

define Exps.New

Exps.Clazz -- grammar and matcher
Exps.Objekt -- grammar and matcher
Exps.Dot -- grammar and matcher
Exps.New -- grammar and matcher

checkType -- Clazz
check -- Objekt
infer -- Dot

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# unification, implicit and vague

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

# recursion

fixpoint and readback

# questions

[design] about sequence

- We want to use `{ x, y, z }` for object literal sugar for `{ x: x, y: y, z: z }`

- Thus `{ x }` is an object literal

- We also want to use `{ ... }` for a sequence of code -- for example `let`

  ```
  {
    let x = ...
    f(x)
  }
  ```

- If we do not use return statement in sequence,
  we can not distinguish `{ x }` from `{ return x }`.

- If we use `return` in sequence, we can write something like:

  ```
  let y = { return x }
  ```

  which reads bad, because `return` sounds like an early return from function.

- What should we do?
