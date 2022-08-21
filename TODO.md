Exp

Core

Value

[maybe] extract Name class -- quit using string primitive

- can implement Name.freshen

# 目标

希望代码能更清晰，一开始就处理好很多之前遇到的问题。

- 使用 unification，而不是简单地判断 Value 之间的相等
  - unification v.s. algebraic subtyping（用格论来处理不等式）
- 一开始就带有 subtyping
- 一开始就带有 递归函数
