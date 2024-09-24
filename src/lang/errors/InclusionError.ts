import { LangError } from "./LangError.js"

export class InclusionError extends LangError {
  trace: Array<string> = []

  constructor(public message: string) {
    super(message)
  }
}
