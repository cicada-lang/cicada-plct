import { LangError } from "./LangError.js"

export class ErrorReport extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
