import { LangError } from "./LangError"

export class ConversionError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
