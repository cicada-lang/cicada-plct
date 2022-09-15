import * as Loggers from "../framework/loggers"
import { Config } from "./config"

export class App {
  config = new Config()
  logger = new Loggers.PrettyLogger()
}
