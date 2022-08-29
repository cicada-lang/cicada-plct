import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Value } from "./Value"

type ValueConstructor = (...args: Array<any>) => Value

export function assertValue<T extends ValueConstructor>(
  ctx: Ctx,
  value: Value,
  valueConstructor: T
): ReturnType<T> {
  const kind = valueConstructor.name

  if (value.kind === kind) {
    return value as ReturnType<T>
  }

  throw new ElaborationError(
    `expect value to have kind: ${kind}, instead of: ${value.kind}`
  )
}
