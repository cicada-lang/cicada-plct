import { ClosureNative } from "../closure"
import * as Values from "../value"
import { GlobalStore } from "./GlobalStore"

export const globals = new GlobalStore()

globals.claim("Type", Values.Type())
globals.define("Type", Values.Type())

globals.claim("String", Values.Type())
globals.define("String", Values.String())

globals.claim("Trivial", Values.Type())
globals.define("Trivial", Values.Trivial())

globals.claim("sole", Values.Trivial())
globals.define("sole", Values.Sole())

globals.registerCode(`

function Pair(A: Type, B: Type): Type {
  return exists (A) B
}

`)

globals.registerCode(`

function the(T: Type, x: T): T {
  return x
}

`)

globals.claim(
  "Equal",
  Values.Pi(
    Values.Type(),
    ClosureNative("T", (T) =>
      Values.Pi(
        T,
        ClosureNative("from", (from) =>
          Values.Pi(
            T,
            ClosureNative("to", (to) => Values.Type()),
          ),
        ),
      ),
    ),
  ),
)

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

globals.claim(
  "refl",
  Values.PiImplicit(
    Values.Type(),
    ClosureNative("T", (T) =>
      Values.PiImplicit(
        T,
        ClosureNative("value", (value) => Values.Equal(T, value, value)),
      ),
    ),
  ),
)

globals.define(
  "refl",
  Values.FnImplicit(
    ClosureNative("T", (T) =>
      Values.FnImplicit(ClosureNative("value", (value) => Values.Refl(T, value))),
    ),
  ),
)

globals.claim(
  "same",
  Values.PiImplicit(
    Values.Type(),
    ClosureNative("T", (T) =>
      Values.Pi(
        T,
        ClosureNative("value", (value) => Values.Equal(T, value, value)),
      ),
    ),
  ),
)

globals.define(
  "same",
  Values.FnImplicit(
    ClosureNative("T", (T) =>
      Values.Fn(ClosureNative("value", (value) => Values.Refl(T, value))),
    ),
  ),
)
