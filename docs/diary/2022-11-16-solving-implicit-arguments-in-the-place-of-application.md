---
title: Solving implicit arguments in the place of application
author: Xie Yuheng
date: 2022-11-16
---

Currently we are solving implicit arguments in the place of application.

We take all the information in the place of application,
after unification, we readback the meta variable
(which will call `solutionAdvanceValue`),
and return core.

But we are still using `mod.solution` as a global variable,
and doing side-effects on them.

It will be better if we can avoid using global variable and side-effects,
and limit the implementation of the feature -- "implicit arguments",
to the elaboratation of application expressions.

# Refactoring notes

[maybe] should not pass `args` to `insertDuringCheck` and `insertDuringInfer`

- This is NOT possible `solveByArgs` also calls `check`.

- During `solveByArgs`'s call to `check`,
  the `argType` might contain meta variables.

  If `check` does not take `solution` as a argument,
  it can not recognize this neutral variables as meta variables.

  (Thus `Solution` should not has `metaVars`.)

[problem] To remove the use of `mod.solution` from `Compute.execute`

- We might readback the solved type and evaluate again, to remove meta variables.
- We might also remove meta variables by apply the class to the solved values.
