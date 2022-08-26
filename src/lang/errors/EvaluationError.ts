import { LangError } from "./LangError"

export class EvaluationError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
