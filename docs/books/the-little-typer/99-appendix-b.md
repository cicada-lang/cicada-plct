---
title: B. Rules Are Made to Be Spoken
date: 2021-10-12
---

# Forms of judgment

A Type system is a system for guiding human judgment.

In an implementation, each _form of judgment_
corresponds to a function that determines
whether a particular judgment is believable
by the Laws and Commandments.

# The forms of judgment for implementations of Pie

The use of [hungarian notation][] in the table below:

| Type   | Variable name          |
| ------ | ---------------------- |
| `Ctx`  | `ctx`                  |
| `Var`  | `x`                    |
| `Exp`  | `e`, `et`              |
| `Core` | `c1`, `c2`, `ct`, `ce` |

[hungarian notation]: https://en.wikipedia.org/wiki/Hungarian_notation

The forms of judgment for implementations of Pie:

| Form of judgment               | Reading                                          |
| ------------------------------ | ------------------------------------------------ |
| `is_ctx(ctx)`                  | `ctx` is a context.                              |
| `fresh(ctx) ~> x`              | `ctx` does not bind `x`.                         |
| `lookup(ctx, x) ~> ct`         | looking up `x` in `ctx` yields the type `ct`.    |
| `is_type(ctx, et) ~> ct`       | `et` represents the type `ct`.                   |
| `the_same_type(ctx, c1, c2)`   | `c1` and `c2` are the same type.                 |
| `check(ctx, e, ct) ~> ce`      | checking `e` can have type `ct` results in `ce`. |
| `infer(ctx, e) ~> the(ct, ce)` | from `e`, infer the `ct` `ce`.                   |
| `the_same(ctx, ct, c1, c2)`    | `c1` is the same `ct` as `c2`.                   |

# Inference rules

Forms of judgment occur within _inference rules_.
An inference rule consists of a horizontal line.
Below the line is a _conclusion_, and above the line
is any number of _premises_.

The meaning of a inference rule is that,
if one believes in the premises,
then one should also believe in the conclusion.

Because the same conclusion can occur in multiple rules,
belief in the premises cannot be derived from belief in the conclusion.

# Translate inference rules to functions

A form of judgment is a relation.

A inference rule conclude a form of judgment
is a Horn clause that defines the relation.

A function is a single-valued (univalent) relation,
where an argument of the relation is viewed as output,
and the output is uniquely determined by all other arguments (inputs).

To translate a relation to a function,
we must observe which argument of the relation is its output,
and writing them in form of `(input, ...) -> output`.

| Parts of inference rule  | Parts of function                         |
| ------------------------ | ----------------------------------------- |
| input of the conclusion  | arguments                                 |
| output of the conclusion | return value                              |
| a promise                | a recursive call to a translated function |
| input of a promise       | arguments of recursive call               |
| output of a promise      | return value of recursive call            |

In the following examples, we use `^o` as postfix superscript,
to denote elaboratation result of the corresponding variable.

Changing from inferring to checking (implement `infer` by `check`),
requires an annotation to check against.

```
is_type(ctx, X) ~> X^o
check(ctx, X^o, exp) ~> exp^o
-------------------------------------------- [the]
infer(ctx, the(X, exp)) ~> the(X^o, exp^o)
```

In bidirectional type checking,
we can read the above inference rule as a function
implementing `infer` in the case of the `the` expression.

```
infer(ctx, the(X, exp)) {
  X^o = is_type(ctx, X)
  exp^o = check(ctx, X^o, exp)
  the(X^o, exp^o)
}
```

Changing from checking to inferring (implement `check` by `infer`),
requires an equality comparison.

```
infer(ctx, exp) ~> the(X1, exp^o)
the_same_type(ctx, X1, X2)
------------------------------------ [switch]
check(ctx, exp, X2) ~> exp^o
```

Read as a function implementing `check` by `infer`
when `infer` is implemented for `exp`.

```
check(ctx, exp, X2) {
  the(X1, exp^o) = infer(ctx, exp)
  the_same_type(ctx, X1, X2)
  exp^o
}
```

A the-expression is the same as its second argument.

```
the_same(ctx, X, exp1, exp2)
------------------------------------ [the_same]
the_same(ctx, X, the(X, exp1), exp2)
```

Read as a function implementing in the case of the `the` expression.

```
the_same(ctx, X, the(X, exp1), exp2) {
  the_same(ctx, X, exp1, exp2)
}
```

# Categories of inference rules

Aside from [the], [switch], and one of the rules for `Type`,
the rules fall into one of a few categories:

1. _formation rules_, which describe the conditions under which an expression is a type;
2. _introduction rules_, which describe the constructors for a type;
3. _elimination rules_, which describe the eliminators for a type;
4. _computation rules_, which describe the behavior of eliminators whose targets are constructors;
5. _eta-rules_, which describe how to turn neutral expressions into values for some types;
6. _other sameness rules_, which describe when sameness of subexpressions implies sameness.

# Reading inference rules

## Sameness

It is important to remember that
rules whose conclusions are sameness judgments
are _specifications_ for a normalization algorithm,
rather than a description of the algorithm itself.

```
the_same(ctx, X, exp2, exp1)
---------------------------- [same_symmetric]
the_same(ctx, X, exp1, exp2)
```

```
the_same(ctx, X, exp1, exp2)
the_same(ctx, X, exp2, exp3)
---------------------------- [same_transitive]
the_same(ctx, X, exp1, exp3)
```

## Variables

```
lookup(ctx, x) ~> X
---------------------------- [hypothesis]
infer(ctx, x) ~> the(X, x)
```

> To infer a type for a variable `x`,
> look it up in the context `ctx`.
> If the lookup succeeds with type `X`,
> infer succeeds with the `Core` expression `the(X, x)`.

```
lookup(ctx, x) ~> X
------------------------ [hypothesis_same]
the_same(ctx, X, x, x)
```

> If a variable `x` is given type `X` by the context `ctx`,
> then conversion checking must find that `x` is the same `X` as `x`.

## String

```
-------------------------------- [string formation]
is_type(ctx, String) ~> String
```

```
------------------------------------ [string same type]
the_same_type(ctx, String, String)
```

```
------------------------------------ [string intro]
infer(ctx, str) ~> the(String, str)
```

> Given a doublequoted literal value `str`,
> I inter its type to be `String`,
> and its core to be the literal value `str` itself.

```
------------------------------------ [string same quote]
the_same(ctx, String, str, str)
```
