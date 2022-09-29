import { LangError } from "./LangError"

export class UnificationError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
