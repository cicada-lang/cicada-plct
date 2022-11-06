---
title: Terminal Objects
---

# Dependencies

```cicada
import { Category } from "Category.md"
```

# Terminal

```cicada
class Terminal {
  cat: Category

  object: cat.Object
  morphism(x: cat.Object): cat.Morphism(x, object)
  morphismUnique(
    implicit x: cat.Object,
    f: cat.Morphism(x, object),
  ): Equal(cat.Morphism(x, object), f, morphism(x))
}
```

# Terminal is an universal construction

If a terminal object exists, it is unique up to unique isomorphism.

<https://github.com/xieyuheng/cat/blob/master/src/category.agda>

```cicada
import { Isomorphism } from "Category.md"
import { equalSwap, equalCompose } from "../equality/index.cic"

function terminal_object_isomorphism(
  cat: Category,
  x: Terminal(cat),
  y: Terminal(cat),
): Isomorphism(cat, x.object, y.object) {
  let f = x.morphism(y.object)
  let g = y.morphism(x.object)

  return {
    cat,
    dom: x.object,
    cod: y.object,
    morphism: y.morphism(x.object),
    inverse: x.morphism(y.object),

    inverseLeft: equalCompose(
      x.morphismUnique(cat.compose(g, f)),
      equalSwap(x.morphismUnique(cat.id(x.object))),
    ),

    inverseRight: equalCompose(
      y.morphismUnique(cat.compose(f, g)),
      equalSwap(y.morphismUnique(cat.id(y.object))),
    ),
  }
}
```

```cicada todo
function terminal_object_isomorphism_without_Fulfilling_class(
  cat: Category,
  x: Terminal(cat),
  y: Terminal(cat),
): Isomorphism {
  let f = x.morphism(y.object)
  let g = y.morphism(x.object)

  return {
    cat,
    dom: x.object,
    cod: y.object,
    morphism: y.morphism(x.object),
    inverse: x.morphism(y.object),

    inverseLeft: equalCompose(
      x.morphismUnique(cat.compose(g, f)),
      equalSwap(x.morphismUnique(cat.id(x.object))),
    ),

    inverseRight: equalCompose(
      y.morphismUnique(cat.compose(f, g)),
      equalSwap(y.morphismUnique(cat.id(y.object))),
    ),
  }
}
```

```cicada todo
function terminal_object_isomorphismUnique(
  cat: Category,
  x: Terminal(cat),
  y: Terminal(cat),
  f: Isomorphism(cat, x.object, y.object),
  g: Isomorphism(cat, x.object, y.object),
): Equal(Isomorphism(cat, x.object, y.object), f, g) {
  return TODO
}
```
