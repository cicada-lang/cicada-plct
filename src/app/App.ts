import * as Loggers from "../framework/loggers"
import { Config } from "./config"
import { HomeFileStore } from "./home"

export class App {
  config = new Config()
  logger = new Loggers.PrettyLogger()
  home = new HomeFileStore()
}
