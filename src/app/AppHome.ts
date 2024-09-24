import { LocalFileStore } from "@cicada-lang/framework/lib/file-stores/LocalFileStore.js"
import os from "os"
import Path from "path"
import process from "process"

export class AppHome extends LocalFileStore {
  constructor() {
    super({
      dir: process.env["CICADA_HOME"] || Path.resolve(os.homedir(), ".cicada"),
    })
  }
}
