import * as commonmark from "commonmark"
import * as Errors from "../lang/errors"
import { Mod } from "../lang/mod"
import { parseStmts } from "../lang/parse"
import { Script } from "../script"

export class MarkdownScript extends Script {
  constructor(public mod: Mod, public text: string) {
    super()
  }

  async run(): Promise<void> {
    try {
      const stmts = parseStmts(this.text)
      await this.mod.executeStmts(stmts)
    } catch (error) {
      if (error instanceof Errors.ElaborationError) {
        throw new Errors.ErrorReport(error.report({ text: this.text }))
      }

      throw error
    }
  }
}

type Entry = { index: number; info: string; code: string }

function collect(text: string): Array<Entry> {
  const reader = new commonmark.Parser()
  const parsed: commonmark.Node = reader.parse(text)
  const entries = []
  const walker = parsed.walker()
  let counter = 0
  let event, node
  while ((event = walker.next())) {
    node = event.node

    if (event.entering && node.type === "code_block") {
      const [start_pos, _end_pos] = node.sourcepos
      const [row, col] = start_pos
      entries.push({
        index: counter++,
        info: node.info || "",
        code: node.literal || "",
      })
    }
  }

  return entries
}
