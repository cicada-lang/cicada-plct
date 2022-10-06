import { ClosureNative, ClosureSimple } from "../closure"
import * as Cores from "../core"
import { EnvCons, EnvNull } from "../env"
import * as Values from "../value"
import { GlobalStore } from "./GlobalStore"

export const globals = new GlobalStore()

globals.registerTypedValue("Type", Values.Type(), Values.Type())
globals.registerTypedValue("String", Values.Type(), Values.String())
globals.registerTypedValue("Trivial", Values.Type(), Values.Trivial())
globals.registerTypedValue("sole", Values.Trivial(), Values.Sole())

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

globals.registerTypedValue(
  "Equal",
  Values.Pi(
    Values.Type(),
    ClosureSimple(
      EnvCons("Type", Values.Type(), EnvNull()),
      "T",
      Cores.Pi("from", Cores.Var("T"), Cores.Pi("to", Cores.Var("T"), Cores.Var("Type"))),
    ),
  ),
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
