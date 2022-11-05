import { LangError } from "./LangError"

export class UnificationError extends LangError {
  trace: Array<string> = []

  constructor(public message: string) {
    super(message)
  }
}
