import * as Values from "../value"
import { GlobalStore } from "./GlobalStore"

export const globals = new GlobalStore()

globals.register("Type", { type: Values.Type(), value: Values.Type() })
globals.register("String", { type: Values.Type(), value: Values.String() })
globals.register("Trivial", { type: Values.Type(), value: Values.Trivial() })
