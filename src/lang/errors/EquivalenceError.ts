import { LangError } from "./LangError.js"

export class EquivalenceError extends LangError {
  trace: Array<string> = []

  constructor(public message: string) {
    super(message)
  }
}
