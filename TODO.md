# pi

Exps.MultiPi first transform to nested Exps.Pi then infer

rename Exps.Fn to Exps.MultiFn

define simple Exps.Fn

Exps.MultiFn first transform to nested Exps.Fn then check

check -- Fn

- with the help of `assertValue`

- simple version that use name in the Fn to extend ctx

  - which might be wrong

infer -- Ap

# sigma

Exps.Sigma -- take multiple typings

- with `bindings: SigmaBinding`

Sigma -- grammar and matcher
Cons -- grammar and matcher
Car -- grammar and matcher
Cdr -- grammar and matcher

Value -- Sigma
Neutral -- Sigma

infer -- Sigma -- to Type
check -- Cons
infer -- Car
infer -- Cdr

# trivial

# Str

# cls

Cls -- grammar and matcher
Obj -- grammar and matcher
Dot -- grammar and matcher

checkType -- Cls
check -- Obj
infer -- Dot

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# statements and testing

Stmts.Compute -- grammar & matcher

- need `readback`
- need `formatCore`

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
