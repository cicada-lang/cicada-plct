# parallel to Pi

evaluation ImplicitFn
formatCore ImplicitFn

parse implicit-fn.test.ts

check-implicit-fn.test.ts

readbackByType -- ImplicitPi

compute-implicit-fn.test.ts

Exps.ImplicitAp

# insertImplicitFn

check Fn -- if given is ImplicitPi, we should insertImplicitFn

# insertImplicitAp

infer Ap -- insertImplicitAp

[maybe] checkByInfer -- when inferred type is ImplicitPi, handle specially

[maybe] deepWalk
