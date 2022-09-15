import { LangError } from "./LangError"

export class EquationError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
