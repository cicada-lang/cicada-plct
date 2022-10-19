import { Command, CommandRunner } from "@xieyuheng/command-line"
import ty from "@xieyuheng/ty"
import fs from "fs"
import Path from "path"
import { Runner } from "../Runner"

type Args = { file: string }
type Opts = { watch?: boolean }

export class RunCommand extends Command<Args, Opts> {
  name = "run"

  description = "Run through an file"

  args = { file: ty.string() }
  opts = { watch: ty.optional(ty.boolean()) }

  runner = new Runner()

  constructor() {
    super()
  }

  // prettier-ignore
  help(runner: CommandRunner): string {
    const { blue } = this.colors

    return [
      `The ${blue(this.name)} command runs through an file,`,
      `evaluating top-level expressions, and prints the results.`,
      ``,
      `It supports ${blue(".md")} and ${blue(".cic")} file extensions.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic`),
      ``,
      `We can also run a URL directly.`,
      ``,
      blue(`  ${runner.name} ${this.name} "https://readonly.link/files/cicada-lang/cicada/-/docs/manual/datatypes/01-nat.md"`),
      ``,
      `You can use ${blue("--watch")} to let the program stand by, and react to changes.`,
      ``,
      blue(`  ${runner.name} ${this.name} tests/trivial/sole.cic --watch`),
      ``,
    ].join("\n")
  }

  async execute(argv: Args & Opts): Promise<void> {
    const url = createURL(argv["file"])
    const { error } = await this.runner.run(url)
    if (error) process.exit(1)

    if (argv["watch"]) {
      await this.runner.watch(url)
    }
  }
}

function createURL(path: string): URL {
  if (ty.uri().isValid(path)) {
    return new URL(path)
  }

  if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
    const fullPath = Path.resolve(path)
    return new URL(`file:${fullPath}`)
  }

  throw new Error(`I can not create URL from path: ${path}`)
}
