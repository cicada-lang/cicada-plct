import { Command, CommandRunner } from "@xieyuheng/command-line"
import { ty } from "@xieyuheng/ty"
import * as Commands from "./index.js"

type Args = { file?: string }
type Opts = { help?: boolean; version?: boolean }

export class Default extends Command<Args, Opts> {
  name = "default"

  description = "Open REPL or run an file"

  args = { file: ty.optional(ty.string()) }
  opts = { help: ty.optional(ty.boolean()) }
  alias = { help: ["h"], version: ["v"] }

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    if (argv["help"]) {
      const command = new Commands.CommonHelp()
      await command.execute({}, runner)
      return
    }

    const file = argv["file"]

    if (file === undefined) {
      const dir = process.cwd()
      const command = new Commands.Repl()
      await command.execute({ dir })
    } else {
      const command = new Commands.Run()
      await command.execute({ file })
    }
  }
}
