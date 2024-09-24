import * as Loggers from "@cicada-lang/framework/lib/loggers/index.js"
import { AppHome } from "./AppHome.js"
import { AppReplEventHandler } from "./AppReplEventHandler.js"

export class App {
  logger = new Loggers.PrettyLogger()
  home = new AppHome()
  replEventHandler = new AppReplEventHandler()
}
