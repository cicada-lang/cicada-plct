import { LangError } from "./LangError.js"

export class ReadbackError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
