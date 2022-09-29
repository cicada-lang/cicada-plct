import { LangError } from "./LangError"

export class ReadbackError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
