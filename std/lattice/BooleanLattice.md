---
title: Boolean Lattice
---

# BooleanLattice

A [boolean lattice (or boolean algebra)](<https://en.wikipedia.org/wiki/Boolean_algebra_(structure)>)
is a _complemented distributive lattice_.

This type of algebraic structure
captures essential properties of
both set operations and logic operations.

```cicada
class BooleanLattice {
  Element: Type

  join(x: Element, y: Element): Element
  meet(x: Element, y: Element): Element

  complement(x: Element): Element

  bottom: Element
  top: Element

  joinCommutative(
    x: Element,
    y: Element,
  ): Equal(
    Element,
    join(x, y),
    join(y, x),
  )

  meetCommutative(
    x: Element,
    y: Element,
  ): Equal(
    Element,
    meet(x, y),
    meet(y, x),
  )

  bottomIdJoin(
    x: Element
  ): Equal(
    Element,
    join(x, bottom),
    x,
  )

  topIdMeet(
    x: Element
  ): Equal(
    Element,
    meet(x, top),
    x,
  )

  joinDistributeMeet(
    x: Element,
    y: Element,
    z: Element
  ): Equal(
    Element,
    join(x, meet(y, z)),
    meet(join(x, y), join(x, z)),
  )

  meetDistributeJoin(
    x: Element,
    y: Element,
    z: Element
  ): Equal(
    Element,
    meet(x, join(y, z)),
    join(meet(x, y), meet(x, z)),
  )

  complementJoinForTop(
    x: Element
  ): Equal(
    Element,
    join(x, complement(x)),
    top,
  )

  complementMeetForBottom(
    x: Element
  ): Equal(
    Element,
    meet(x, complement(x)),
    bottom,
  )
}
```

# Duality

```cicada
function dual(lattice: BooleanLattice): BooleanLattice {
  return {
    Element: lattice.Element,

    join: lattice.meet,
    meet: lattice.join,

    complement: lattice.complement,

    bottom: lattice.top,
    top: lattice.bottom,

    joinCommutative: lattice.meetCommutative,
    meetCommutative: lattice.joinCommutative,

    bottomIdJoin: lattice.topIdMeet,
    topIdMeet: lattice.bottomIdJoin,

    joinDistributeMeet: lattice.meetDistributeJoin,
    meetDistributeJoin: lattice.joinDistributeMeet,

    complementJoinForTop: lattice.complementMeetForBottom,
    complementMeetForBottom: lattice.complementJoinForTop,
  }
}
```

The `dual` of `BooleanLattice` is [involutive](<https://en.wikipedia.org/wiki/Involution_(mathematics)>).

```cicada
function dualInvolutive(lattice: BooleanLattice): Equal(
  BooleanLattice,
  lattice,
  dual(dual(lattice)),
) {
  return refl
}
```

# Unique identity

```cicada
import { equalSwap, equalCompose } from "../equality/index.cic"
```

```cicada
function joinUniqueId(
  lattice: BooleanLattice,
  o: lattice.Element,
  o_is_identity_of_join: (x: lattice.Element) -> Equal(
    lattice.Element,
    lattice.join(x, o),
    x,
  ),
): Equal(lattice.Element, o, lattice.bottom) {
  check equalSwap(o_is_identity_of_join(lattice.bottom)): Equal(
    lattice.Element,
    lattice.bottom,
    lattice.join(lattice.bottom, o),
  )

  check lattice.joinCommutative(lattice.bottom, o): Equal(
    lattice.Element,
    lattice.join(lattice.bottom, o),
    lattice.join(o, lattice.bottom),
  )

  check lattice.bottomIdJoin(o): Equal(
    lattice.Element,
    lattice.join(o, lattice.bottom),
    o,
  )

  return equalSwap(
    equalCompose(
      equalSwap(o_is_identity_of_join(lattice.bottom)),
      equalCompose(
        lattice.joinCommutative(lattice.bottom, o),
        lattice.bottomIdJoin(o)),
    )
  )
}
```

```cicada wishful-thinking
function joinUniqueId(
  lattice: BooleanLattice,
  o: lattice.Element,
  o_is_identity_of_join: (x: lattice.Element) -> Equal(
    lattice.Element,
    lattice.join(x, o),
    x,
  ),
): Equal(lattice.Element, o, lattice.bottom) {
  return equal_rewrite (lattice.Element) {
    lattice.bottom
    by equalSwap(o_is_identity_of_join(lattice.bottom))
    lattice.join(lattice.bottom, o)
    by lattice.joinCommutative(lattice.bottom, o)
    lattice.join(o, lattice.bottom)
    by lattice.bottomIdJoin(o)
    o
  }
}
```

```cicada
function meet_unique_identity(
  lattice: BooleanLattice,
  i: lattice.Element,
  i_is_identity_of_meet: (x: lattice.Element) -> Equal(
    lattice.Element,
    lattice.meet(x, i),
    x,
  ),
): Equal(lattice.Element, i, lattice.top) {
  return joinUniqueId(
    dual(lattice),
    i,
    i_is_identity_of_meet,
  )
}
```

# Idempotence

<https://en.wikipedia.org/wiki/Idempotence>

```cicada
import { equalMap } from "../equality/index.cic"
```

```cicada
function join_is_idempotent(
  lattice: BooleanLattice,
  x: lattice.Element,
): Equal(
  lattice.Element,
  lattice.join(x, x),
  x,
) {
  check equalSwap(lattice.topIdMeet(lattice.join(x, x))): Equal(
    lattice.Element,
    lattice.join(x, x),
    lattice.meet(lattice.join(x, x), lattice.top),
  )

  check equalSwap(lattice.complementJoinForTop(x)): Equal(
    lattice.Element,
    lattice.top,
    lattice.join(x, lattice.complement(x)),
  )

  check equalMap(
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.meet(lattice.join(x, x), z),
    ),
    equalSwap(lattice.complementJoinForTop(x)),
  ): Equal(
    lattice.Element,
    lattice.meet(lattice.join(x, x), lattice.top),
    lattice.meet(lattice.join(x, x), lattice.join(x, lattice.complement(x))),
  )

  check equalSwap(lattice.joinDistributeMeet(x, x, lattice.complement(x))): Equal(
    lattice.Element,
    lattice.meet(lattice.join(x, x), lattice.join(x, lattice.complement(x))),
    lattice.join(x, lattice.meet(x, lattice.complement(x))),
  )

  check lattice.complementMeetForBottom(x): Equal(
    lattice.Element,
    lattice.meet(x, lattice.complement(x)),
    lattice.bottom,
  )

  check equalMap(
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.join(x, z),
    ),
    lattice.complementMeetForBottom(x),
  ): Equal(
    lattice.Element,
    lattice.join(x, lattice.meet(x, lattice.complement(x))),
    lattice.join(x, lattice.bottom),
  )

  check lattice.bottomIdJoin(x): Equal(
    lattice.Element,
    lattice.join(x, lattice.bottom),
    x,
  )

  return equalCompose(
    equalSwap(lattice.topIdMeet(lattice.join(x, x))),
    equalCompose(
      equalMap(
        the(
          (lattice.Element) -> lattice.Element,
          (z) => lattice.meet(lattice.join(x, x), z),
        ),
        equalSwap(lattice.complementJoinForTop(x)),
      ),
      equalCompose(
        equalSwap(lattice.joinDistributeMeet(x, x, lattice.complement(x))),
        equalCompose(
          equalMap(
            the(
              (lattice.Element) -> lattice.Element,
              (z) => lattice.join(x, z),
            ),
            lattice.complementMeetForBottom(x),
          ),
          lattice.bottomIdJoin(x)
        )
      )
    )
  )
}
```

```cicada
function meet_is_idempotent(
  lattice: BooleanLattice,
  x: lattice.Element,
): Equal(
  lattice.Element,
  lattice.meet(x, x),
  x,
) {
  return join_is_idempotent(dual(lattice), x)
}
```

# Order relation

We can define order relation by lattice operations.

```cicada
function Under(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Type {
  return Equal(
    lattice.Element,
    lattice.join(x, y),
    y,
  )
}
```

```cicada
function Above(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Type {
  return Under(dual(lattice), x, y)
}
```

TODO `Above` is the swap of `Under`

TODO `Under` is the swap of `Above`

# Boundaries

<https://en.wikipedia.org/wiki/Bounded_lattice>

```cicada
function top_is_at_the_top(
  lattice: BooleanLattice,
  x: lattice.Element,
): Under(lattice, x, lattice.top) {
  check refl: Equal(
    Type,
    Under(lattice, x, lattice.top),
    Equal(
      lattice.Element,
      lattice.join(x, lattice.top),
      lattice.top,
    )
  )

  check equalSwap(lattice.topIdMeet(lattice.join(x, lattice.top))): Equal(
    lattice.Element,
    lattice.join(x, lattice.top),
    lattice.meet(lattice.join(x, lattice.top), lattice.top),
  )

  check lattice.meetCommutative(lattice.join(x, lattice.top), lattice.top): Equal(
    lattice.Element,
    lattice.meet(lattice.join(x, lattice.top), lattice.top),
    lattice.meet(lattice.top, lattice.join(x, lattice.top)),
  )

  check equalMap(
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.meet(z, lattice.join(x, lattice.top)),
    ),
    equalSwap(lattice.complementJoinForTop(x)),
  ): Equal(
    lattice.Element,
    lattice.meet(lattice.top, lattice.join(x, lattice.top)),
    lattice.meet(lattice.join(x, lattice.complement(x)), lattice.join(x, lattice.top)),
  )

  check equalSwap(
    lattice.joinDistributeMeet(x, lattice.complement(x), lattice.top)
  ): Equal(
    lattice.Element,
    lattice.meet(lattice.join(x, lattice.complement(x)), lattice.join(x, lattice.top)),
    lattice.join(x, lattice.meet(lattice.complement(x), lattice.top)),
  )

  check equalMap(
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.join(x, z),
    ),
    lattice.topIdMeet(lattice.complement(x)),
  ): Equal(
    lattice.Element,
    lattice.join(x, lattice.meet(lattice.complement(x), lattice.top)),
    lattice.join(x, lattice.complement(x)),
  )

  check lattice.complementJoinForTop(x): Equal(
    lattice.Element,
    lattice.join(x, lattice.complement(x)),
    lattice.top,
  )

  return equalCompose(
    equalSwap(lattice.topIdMeet(lattice.join(x, lattice.top))),
    equalCompose(
      lattice.meetCommutative(lattice.join(x, lattice.top), lattice.top),
      equalCompose(
        equalMap(
          the(
            (lattice.Element) -> lattice.Element,
            (z) => lattice.meet(z, lattice.join(x, lattice.top)),
          ),
          equalSwap(lattice.complementJoinForTop(x)),
        ),
        equalCompose(
          equalSwap(
            lattice.joinDistributeMeet(x, lattice.complement(x), lattice.top)
          ),
          equalCompose(
            equalMap(
              the(
                (lattice.Element) -> lattice.Element,
                (z) => lattice.join(x, z),
              ),
              lattice.topIdMeet(lattice.complement(x)),
            ),
            lattice.complementJoinForTop(x),
          )
        )
      )
    )
  )
}
```

```cicada
function bottom_is_at_the_bottom(
  lattice: BooleanLattice,
  x: lattice.Element,
): Above(lattice, x, lattice.bottom) {
  return top_is_at_the_top(dual(lattice), x)
}
```

# Absorption law

<https://en.wikipedia.org/wiki/Absorption_law>

<https://en.wikipedia.org/wiki/Absorption_(logic)>

The terminology, which might be introduced by Russell and Whitehead, is very confusing.

```cicada
function join_absorb_over_meet(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Equal(
  lattice.Element,
  lattice.join(x, lattice.meet(x, y)),
  x,
) {
  let eq1: Equal(
    lattice.Element,
    lattice.join(x, lattice.meet(x, y)),
    lattice.join(lattice.meet(x, lattice.top), lattice.meet(x, y)),
  ) = equalMap(
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.join(z, lattice.meet(x, y)),
    ),
    equalSwap(lattice.topIdMeet(x)),
  )

  let eq2: Equal(
    lattice.Element,
    lattice.join(lattice.meet(x, lattice.top), lattice.meet(x, y)),
    lattice.meet(x, lattice.join(lattice.top, y)),
  ) = equalSwap(lattice.meetDistributeJoin(x, lattice.top, y))

  let eq3: Equal(
    lattice.Element,
    lattice.meet(x, lattice.join(lattice.top, y)),
    lattice.meet(x, lattice.join(y, lattice.top)),
  ) = equalMap(
    the((lattice.Element) -> lattice.Element, (z) => lattice.meet(x, z)),
    lattice.joinCommutative(lattice.top, y),
  )

  let eq4: Equal(
    lattice.Element,
    lattice.meet(x, lattice.join(y, lattice.top)),
    lattice.meet(x, lattice.top),
  ) = equalMap(
    the((lattice.Element) -> lattice.Element, (z) => lattice.meet(x, z)),
    top_is_at_the_top(lattice, y),
  )

  let eq5: Equal(
    lattice.Element,
    lattice.meet(x, lattice.top),
    x,
  ) = lattice.topIdMeet(x)

  return equalCompose(
    eq1,
    equalCompose(
      eq2,
      equalCompose(
        eq3,
        equalCompose(
          eq4,
          eq5,
        )
      )
    )
  )
}
```

```cicada
function meet_absorb_over_join(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Equal(
  lattice.Element,
  lattice.meet(x, lattice.join(x, y)),
  x,
) {
  return join_absorb_over_meet(dual(lattice), x, y)
}
```

# Associativity

```cicada todo
function joinAssociative(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
  z: lattice.Element,
): Equal(
  lattice.Element,
  lattice.join(x, lattice.join(y, z)),
  lattice.join(lattice.join(x, y), z),
) {
  return TODO
}

function meetAssociative(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
  z: lattice.Element,
): Equal(
  lattice.Element,
  lattice.meet(x, lattice.meet(y, z)),
  lattice.meet(lattice.meet(x, y), z),
) {
  return TODO
}
```

# Two-element Boolean algebra

<https://en.wikipedia.org/wiki/Two-element_Boolean_algebra>

TODO

```cicada todo

```
