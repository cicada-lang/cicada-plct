# parallel to Pi

unfoldAp -- ImplicitAp
Cores.ImplicitAp
Neutrals.ImplicitAp

compute-implicit-fn.test.ts -- "compute ImplicitFn -- ImplicitAp"

# insertImplicitFn

check Fn -- if given is ImplicitPi, we should insertImplicitFn

# insertImplicitAp

infer Ap -- insertImplicitAp

[maybe] checkByInfer -- when inferred type is ImplicitPi, handle specially

[maybe] deepWalk
