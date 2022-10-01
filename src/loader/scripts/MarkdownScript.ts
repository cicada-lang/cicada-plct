import { Mod } from "../../lang/mod"
import { Script } from "../Script"

export class MarkdownScript extends Script {
  constructor(public mod: Mod) {
    super()
  }

  async run(): Promise<void> {
    //
  }
}
