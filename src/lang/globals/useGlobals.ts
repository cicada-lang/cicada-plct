import * as Actions from "../actions/index.js"
import { ClosureNative } from "../closure/index.js"
import * as Values from "../value/index.js"
import { GlobalStore } from "./GlobalStore.js"

let globals: GlobalStore | undefined = undefined

export function useGlobals(): GlobalStore {
  if (globals) return globals

  globals = new GlobalStore()

  globals.claim("Type", Values.Type())
  globals.define("Type", Values.Type())

  globals.claim("String", "Type")
  globals.define("String", Values.String())

  globals.claim("Trivial", "Type")
  globals.define("Trivial", Values.Trivial())

  globals.claim("sole", "Trivial")
  globals.define("sole", Values.Sole())

  globals.claim("Pair", "(A: Type, B: Type) -> Type")
  globals.define("Pair", "(A, B) => exists (A) B")

  globals.claim(
    "car",
    `(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  target: exists (x: A) B(x),
) -> A
`,
  )
  globals.define(
    "car",
    Values.FnImplicit(
      ClosureNative("A", (A) =>
        Values.FnImplicit(
          ClosureNative("B", (B) =>
            Values.Fn(
              ClosureNative("target", (target) => Actions.doCar(target)),
            ),
          ),
        ),
      ),
    ),
  )

  globals.claim(
    "cdr",
    `(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  target: exists (x: A) B(x),
) -> B(car(target))
`,
  )
  globals.define(
    "cdr",
    Values.FnImplicit(
      ClosureNative("A", (A) =>
        Values.FnImplicit(
          ClosureNative("B", (B) =>
            Values.Fn(
              ClosureNative("target", (target) => Actions.doCdr(target)),
            ),
          ),
        ),
      ),
    ),
  )

  globals.claim("the", "(T: Type, x: T) -> T")
  globals.define("the", "(T, x) => x")

  globals.claim("Equal", "(T: Type, from: T, to: T) -> Type")
  globals.define(
    "Equal",
    Values.Fn(
      ClosureNative("T", (T) =>
        Values.Fn(
          ClosureNative("from", (from) =>
            Values.Fn(ClosureNative("to", (to) => Values.Equal(T, from, to))),
          ),
        ),
      ),
    ),
  )

  globals.claim("refl", "(implicit T: Type, implicit x: T) -> Equal(T, x, x)")
  globals.define(
    "refl",
    Values.FnImplicit(
      ClosureNative("T", (T) =>
        Values.FnImplicit(
          ClosureNative("value", (value) => Values.Refl(T, value)),
        ),
      ),
    ),
  )

  globals.claim("same", "(implicit T: Type, x: T) -> Equal(T, x, x)")
  globals.define(
    "same",
    Values.FnImplicit(
      ClosureNative("T", (T) =>
        Values.Fn(ClosureNative("value", (value) => Values.Refl(T, value))),
      ),
    ),
  )

  globals.claim(
    "replace",
    `(
  implicit T: Type,
  implicit from: T,
  implicit to: T,
  target: Equal(T, from, to),
  motive: (T) -> Type,
  base: motive(from),
) -> motive(to)
`,
  )
  globals.define(
    "replace",
    Values.FnImplicit(
      ClosureNative("T", (T) =>
        Values.FnImplicit(
          ClosureNative("from", (from) =>
            Values.FnImplicit(
              ClosureNative("to", (to) =>
                Values.Fn(
                  ClosureNative("target", (target) =>
                    Values.Fn(
                      ClosureNative("motive", (motive) =>
                        Values.Fn(
                          ClosureNative("base", (base) =>
                            Actions.doReplace(target, motive, base),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )

  globals.claim(
    "equalMap",
    `(
  implicit X: Type,
  implicit Y: Type,
  implicit from: X,
  implicit to: X,
  f: (X) -> Y,
  target: Equal(X, from, to),
) -> Equal(Y, f(from), f(to))
`,
  )
  globals.define(
    "equalMap",
    `(
  implicit X,
  implicit Y,
  implicit from,
  implicit to,
  f,
  target,
) => {
  return replace(
    target,
    (x) => Equal(Y, f(from), f(x)),
    refl,
  )
}
`,
  )

  globals.claim(
    "equalSwap",
    `(
    implicit A: Type,
    implicit x: A,
    implicit y: A,
    xyEqual: Equal(A, x, y),
  ) -> Equal(A, y, x)
`,
  )
  globals.define(
    "equalSwap",
    `(
  implicit A,
  implicit x,
  implicit y,
  xyEqual,
) => {
  return replace(
    xyEqual,
    (w) => Equal(A, w, x),
    refl,
  )
}
`,
  )

  globals.claim(
    "equalCompose",
    `(
    implicit A: Type,
    implicit x: A,
    implicit y: A,
    implicit z: A,
    xyEqual: Equal(A, x, y),
    yzEqual: Equal(A, y, z),
  ) -> Equal(A, x, z)
`,
  )
  globals.define(
    "equalCompose",
    `(
  implicit A,
  implicit x,
  implicit y,
  implicit z,
  xyEqual,
  yzEqual,
) => {
  return replace(
    yzEqual,
    (w) => Equal(A, x, w),
    xyEqual,
  )
}
`,
  )

  return globals
}
