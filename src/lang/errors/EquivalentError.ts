import { LangError } from "./LangError"

export class EquivalentError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
