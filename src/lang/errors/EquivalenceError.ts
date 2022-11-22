import { LangError } from "./LangError"

export class EquivalenceError extends LangError {
  trace: Array<string> = []

  constructor(public message: string) {
    super(message)
  }
}
