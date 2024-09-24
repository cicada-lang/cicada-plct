import { CommandRunner } from "@xieyuheng/command-line/lib/command-runner/index.js"
import * as CommandRunners from "@xieyuheng/command-line/lib/command-runners/index.js"
import "../app/index.js"
import * as Commands from "./commands/index.js"

export function createCommandRunner(): CommandRunner {
  return new CommandRunners.CommonCommandRunner({
    defaultCommand: new Commands.Default(),
    commands: [
      new Commands.Repl(),
      new Commands.Run(),
      new Commands.CommonHelp(),
    ],
  })
}
