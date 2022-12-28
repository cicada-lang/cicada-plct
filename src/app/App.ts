import * as Loggers from "@cicada-lang/framework/lib/loggers"
import { AppConfig } from "./AppConfig"
import { AppHome } from "./AppHome"
import { AppReplEventHandler } from "./AppReplEventHandler"

export class App {
  logger = new Loggers.PrettyLogger()
  config = new AppConfig()
  home = new AppHome()
  replEventHandler = new AppReplEventHandler()
}
