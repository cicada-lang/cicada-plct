import * as pt from "@cicada-lang/partech"
import type { Span } from "../span"
import { LangError } from "./LangError"

export class ElaborationError extends LangError {
  constructor(public message: string, public options: { span?: Span }) {
    super(message)
  }

  report(text?: string): string {
    if (this.options.span && text) {
      return [this.message + "\n", pt.report(this.options.span, text)].join(
        "\n",
      )
    }

    return this.message
  }
}
