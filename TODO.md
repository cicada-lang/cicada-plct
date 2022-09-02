# clazz

Exps.Clazz -- grammar and matcher
Exps.Objekt -- grammar and matcher
Exps.Dot -- grammar and matcher
Exps.New -- grammar and matcher

define Exps.New

checkType -- Clazz
check -- Objekt
check -- New
infer -- Dot

Values.Clazz
Values.Objekt
Neutrals.Dot

formatCore -- Clazz
formatCore -- Objekt
formatCore -- New
formatCore -- Dot

evaluate -- Clazz
evaluate -- Objekt
evaluate -- New
evaluate -- Dot

doDot

# datatype

Exp -- Datatype
Exp -- TypeConstructor
Exp -- DataConstructor

# pi

Exps.FnAnnotated -- can be inferred
check -- Exps.FnAnnotated -- checkByInfer
infer -- Exps.FnAnnotated
unfoldMultiFn -- return Exps.FnAnnotated

MultiApWithReturnType
Exps.FnWithReturnType
Exps.FnAnnotatedWithReturnType

# unification, implicit and vague

isNeutralVar

- we will use NeutralVar as pattern variable (or say logic variable)

NeutralVar constructor

# recursion

fixpoint and readback
