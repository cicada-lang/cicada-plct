import { LangError } from "./LangError"

export class InclusionError extends LangError {
  trace: Array<string> = []

  constructor(public message: string) {
    super(message)
  }
}
