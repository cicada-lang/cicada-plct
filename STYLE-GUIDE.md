---
title: Style Guide
---

**In general, observe the style of existing code and respect it.**

# About `framework/`

Modules in `framework/` directory are independent helper modules
that might be extracted to their own packages.

# Hierarchy of resources

Think of the system as a hierarchy of resources:

```
Project -> Mod -> Stmt -> Exp
```

Top-level syntax of module is statement oriented -- `Stmt`.

# Semantics architecture

Use first-order syntax to implement `Exp`.

When necessary, use `subst` to do substitution.

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
