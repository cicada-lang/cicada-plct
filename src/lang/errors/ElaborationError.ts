import pt from "@cicada-lang/partech"
import { Span } from "../span"
import { LangError } from "./LangError"

export class ElaborationError extends LangError {
  constructor(public message: string, public options: { span?: Span }) {
    super(message)
  }

  report(options?: { text?: string }): string {
    if (this.options.span && options?.text) {
      return [
        this.message + "\n",
        pt.report(this.options.span, options.text),
      ].join("\n")
    }

    return this.message
  }
}
