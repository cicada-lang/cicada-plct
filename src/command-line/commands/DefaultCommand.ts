import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import * as Commands from "../commands"

type Args = { file?: string }
type Opts = { help?: boolean; version?: boolean }

export class DefaultCommand extends Command<Args, Opts> {
  name = "default"

  description = "Open REPL or run an file"

  args = { file: ty.optional(ty.string()) }
  opts = { help: ty.optional(ty.boolean()), version: ty.optional(ty.boolean()) }
  alias = { help: ["h"], version: ["v"] }

  async execute(argv: Args & Opts, runner: CommandRunner): Promise<void> {
    if (argv["help"]) {
      const command = new Commands.CommonHelpCommand()
      await command.execute({}, runner)
      return
    }

    if (argv["version"]) {
      console.log(app.config.pkg.version)
      return
    }

    const file = argv["file"]

    if (file === undefined) {
      const dir = process.cwd()
      const command = new Commands.ReplCommand()
      await command.execute({ dir })
    } else {
      const command = new Commands.RunCommand()
      await command.execute({ file })
    }
  }
}
