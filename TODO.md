# clazz

define Exps.New

[refactor] parse/grammars -- one file one grammar

- file name follows grammar name

[refactor] parse/matchers -- one file one matcher

- file name follows matcher name

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
