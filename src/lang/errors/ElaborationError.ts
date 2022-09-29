import { LangError } from "./LangError"

export class ElaborationError extends LangError {
  constructor(public message: string) {
    super(message)
  }
}

// import { Span } from "../span"
// import { LangError } from "./LangError"

// export class ElaborationError extends LangError {
//   constructor(public message: string, public options: { span: Span }) {
//     super(message)
//   }
// }
