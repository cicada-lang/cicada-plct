# type checking

checkType -- making tests/infer-var.test.ts pass

Stmts.Compute -- grammar & matcher
Stmts.Let -- grammar & matcher

# pi

Exps.Pi -- take multiple bindings
Exps.Fn -- take multiple bindings

support annotated `Fn`

checkType -- Pi
infer -- Ap
check -- Fn

# sigma

Sigma -- grammar and matcher
Cons -- grammar and matcher
Car -- grammar and matcher
Cdr -- grammar and matcher

Exps.Sigma -- take multiple bindings

Value -- Sigma
Neutral -- Sigma

checkType -- Sigma
check -- Cons
infer -- Car
infer -- Cdr

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
