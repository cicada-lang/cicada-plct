---
title: Initial Objects
---

# Dependencies

```cicada
import { Category } from "Category.md"
```

# Initial

```cicada
class Initial {
  cat: Category

  object: cat.Object

  morphism(x: cat.Object): cat.Morphism(object, x)

  morphism_unique(
    implicit x: cat.Object,
    f: cat.Morphism(object, x),
  ): Equal(cat.Morphism(object, x), f, morphism(x))
}
```
