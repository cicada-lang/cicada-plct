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

function the(T: Type, x: T): T {
  return x
}

`)
