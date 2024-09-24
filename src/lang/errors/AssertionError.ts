import { LangError } from "./LangError.js"

export class AssertionError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
