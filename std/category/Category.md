---
title: Category Theory
---

# Introduction

> Category theory formalizes mathematical structure and its concepts in
> terms of a labeled directed graph called a category, whose nodes are
> called objects, and whose labelled directed edges are called arrows
> (or morphisms). A category has two basic properties: the ability to
> compose the arrows associatively, and the existence of an identity
> arrow for each object.
>
> -- [Wikipedia / Category Theory](https://en.wikipedia.org/wiki/Category_theory)

# Category

To each species of mathematical structure,
there corresponds a category whose objects have that structure,
and whose morphisms respect [preserve] it.

```cicada
class Category {
  Object: Type

  Morphism(dom: Object, cod: Object): Type

  id(x: Object): Morphism(x, x)

  compose(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
    implicit z: Object,
    g: Morphism(y, z),
  ): Morphism(x, z)

  idLeft(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y)
  ): Equal(Morphism(x, y), compose(id(x), f), f)

  idRight(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
  ): Equal(Morphism(x, y), compose(f, id(y)), f)

  composeAssociative(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
    implicit z: Object,
    g: Morphism(y, z),
    implicit w: Object,
    h: Morphism(z, w),
  ): Equal(
    Morphism(x, w),
    compose(f, compose(g, h)),
    compose(compose(f, g), h)
  )
}
```

# Isomorphism

Two objects have the same structure iff they are isomorphic,
and an "abstract object" is an isomorphism class of objects.

```cicada
class Isomorphism {
  cat: Category
  dom: cat.Object
  cod: cat.Object
  morphism: cat.Morphism(dom, cod)
  inverse: cat.Morphism(cod, dom)

  inverseLeft: Equal(
    cat.Morphism(dom, dom),
    cat.compose(morphism, inverse),
    cat.id(dom),
  )

  inverseRight: Equal(
    cat.Morphism(cod, cod),
    cat.compose(inverse, morphism),
    cat.id(cod),
  )
}
```
