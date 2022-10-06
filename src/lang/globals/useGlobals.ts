import { ClosureNative } from "../closure"
import * as Values from "../value"
import { GlobalStore } from "./GlobalStore"

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
        Values.FnImplicit(ClosureNative("value", (value) => Values.Refl(T, value))),
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

  return globals
}
