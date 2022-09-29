import { LangError } from "./LangError"

export class AssertionError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
