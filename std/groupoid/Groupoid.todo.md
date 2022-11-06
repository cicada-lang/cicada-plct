---
title: Groupoid Theory
---

# Dependencies

```cicada
import { Category, Isomorphism } from "../category/index.cic"
```

# Groupoid

```cicada
class Groupoid extends Category {
  inv(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
  ): Morphism(y, x)

  // NOTE The following use of `Isomorphism`
  //   is an example of "partly fulfilled object construction".
  inv_iso(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
  ): Isomorphism(super, x, y, f, inv(f))
}
```

## A trivial groupoid

```cicada
import { trivialCategory } from "../category/index.cic"

let trivial_isomorphism_t = Isomorphism(trivialCategory, sole, sole, sole, sole)

let trivial_isomorphism: trivial_isomorphism_t = {
  cat: trivialCategory,

  dom: sole,
  cod: sole,
  morphism: sole,
  inverse: sole,

  inverseLeft: refl,
  inverseRight: refl,
}

let trivial_groupoid: Groupoid = {
  ...trivialCategory,

  inv: (f) => sole,
  inv_iso: (f) => trivial_isomorphism,
}
```
