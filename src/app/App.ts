import * as Loggers from "../framework/loggers"
import { Config } from "./Config"
import { HomeFileStore } from "./HomeFileStore"

export class App {
  config = new Config()
  logger = new Loggers.PrettyLogger()
  home = new HomeFileStore()
}
