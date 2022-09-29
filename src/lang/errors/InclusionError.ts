import { LangError } from "./LangError"

export class InclusionError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}
