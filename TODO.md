# sigma

evaluate -- Sigma

formatCore -- Sigma
formatCore -- Cons
formatCore -- Car
formatCore -- Cdr

readback -- Sigma
readback -- Cons

readbackNeutral -- Car
readbackNeutral -- Car

# trivial

typeDirectedReadback -- Trivial

```
readback_eta_expansion(ctx: Ctx, value: Value): Core {
  // NOTE the η-rule for trivial states that
  //   all of its inhabitants are the same as sole.
  //   This is implemented by reading the all back as sole.
  return new Exps.GlobalCore("sole")
}
```

# string

Exps.Quote
Cores.Quote
Values.Quote

check-quote.test.ts
compute-quote.test.ts

# clazz

define Exps.New

Exps.Clazz -- grammar and matcher
Exps.Objekt -- grammar and matcher
Exps.Dot -- grammar and matcher
Exps.New -- grammar and matcher

checkType -- Clazz
check -- Objekt
infer -- Dot

doDot

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# pi

Exps.FnAnnotated -- can be inferred
check -- Exps.FnAnnotated -- checkByInfer
infer -- Exps.FnAnnotated
foldMultiFn -- return Exps.FnAnnotated

MultiApWithReturnType
Exps.FnWithReturnType
Exps.FnAnnotatedWithReturnType

# unification, implicit and vague

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

# recursion

fixpoint and readback
