---
title: Style Guide
---

**Principle 1: The aim of a style guide is for people to write code that looks like one person wrote it.**

**Principle 2: In general, observe the style of existing code and respect it.**

# About commits and pull requests

Do commits and pull requests in small steps.

We loosely follows: https://rfc.zeromq.org/spec/42

We do not force any commit message style,
just write clear and easy to understand messages.

# Use of abbreviations

In documentation and everyday discussion,
do not use too much abbreviations.

If you must, explain them before using.

# About code examples

When writing code example in discussion,
please use cicada's syntax as much as possible.

If your code example include newly designed syntax,
please follow cicada's established syntax style
(a variant of C-family syntax).

When analyzing and comparing other language's feature,
please provide corresponding code example in cicada's syntax.

If you do not follow the above rules,
it is highly likely you will be ignored by our community.

# About `framework/`

Modules in `framework/` directory are independent helper modules
that might be extracted to their own packages.

# Open v.s. closed types

Beware of open v.s. closed types,

- Open types: `Stmt`, ...
- Closed types: `Exp`, `Core`, ...

We use object-oriented style for open types,
and use functional style for closed types.

## About modules

For open types: one class, one file.

For closed types: almost one function, one file, except for constructors.

## About file name

File name should be the same as class or function name,
to avoid name casting when editing the code.

## About directory name

Use `lisp-case` for directory name.
