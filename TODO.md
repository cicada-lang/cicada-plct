# implicit-ap-insertion-during-check

extract insertion/solveArgTypes
extract insertion/applyInsertions
extract insertion/solveRetType

inline insertImplicitAp

checkByInfer -- when inferred type is ImplicitPi, handle it specially
