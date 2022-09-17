# parallel to Pi

evaluate ImplicitAp
formatCore ImplicitAp
fix doAp for ImplicitAp
Neutrals.ImplicitAp

compute-implicit-ap.test.ts -- "compute ImplicitAp"

# insertImplicitFn

check Fn -- if given is ImplicitPi, we should insertImplicitFn

# insertImplicitAp

infer Ap -- insertImplicitAp

[maybe] checkByInfer -- when inferred type is ImplicitPi, handle specially

[maybe] deepWalk
