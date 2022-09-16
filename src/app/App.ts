import * as Loggers from "../framework/loggers"
import { AppConfig } from "./AppConfig"
import { AppHome } from "./AppHome"
import { AppReplEventHandler } from "./AppReplEventHandler"

export class App {
  logger = new Loggers.PrettyLogger()

  config = new AppConfig()
  home = new AppHome()
  replEventHandler = new AppReplEventHandler()
}
