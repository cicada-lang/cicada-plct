import { GlobalStore } from "./GlobalStore"
import { Type } from "./Type"

export const globals = new GlobalStore()

globals.register(Type)
