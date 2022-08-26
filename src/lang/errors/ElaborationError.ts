export class ElaborationError extends Error {
  constructor(public message: string) {
    super(message)
  }
}
