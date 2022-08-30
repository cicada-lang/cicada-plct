import * as Values from "../value"
import { GlobalStore } from "./GlobalStore"

export const globals = new GlobalStore()

globals.register("Type", {
  type: Values.Type(),
  value: Values.Type(),
})
