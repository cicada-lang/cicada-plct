import { LangError } from "./LangError"

export class ErrorReport extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
