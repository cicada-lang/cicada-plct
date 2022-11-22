import { LangError } from "./LangError"

export class EquivalenceError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
