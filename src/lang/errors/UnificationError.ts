import { LangError } from "./LangError.js"

export class UnificationError extends LangError {
  trace: Array<string> = []

  constructor(public message: string) {
    super(message)
  }
}
