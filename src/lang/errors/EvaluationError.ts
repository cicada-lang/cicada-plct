import { LangError } from "./LangError.js"

export class EvaluationError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
