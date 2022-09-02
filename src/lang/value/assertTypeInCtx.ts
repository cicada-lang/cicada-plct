import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { AlreadyType, Value } from "./Value"

type AlreadyTypeConstructor = (...args: Array<any>) => AlreadyType

/**

   # assertTypeInCtx

   Given the `ctx`, we have the opportunity
   to `readback` the `value` and print it in error report.

**/

export function assertTypeInCtx<T extends AlreadyTypeConstructor>(
  ctx: Ctx,
  value: Value,
  alreadyTypeConstructor: T
): asserts value is ReturnType<T> {
  const kind = alreadyTypeConstructor.name

  if (value.kind !== kind) {
    throw new ElaborationError(
      `expect value to be type and to have kind: ${kind}, instead of: ${value.kind}`
    )
  }
}

type ElementReturnTypeUnion<T extends Array<AlreadyTypeConstructor>> =
  T extends (infer E extends AlreadyTypeConstructor)[] ? ReturnType<E> : never

export function assertTypesInCtx<T extends Array<AlreadyTypeConstructor>>(
  ctx: Ctx,
  value: Value,
  alreadyTypeConstructors: T
): asserts value is ElementReturnTypeUnion<T> {
  const kinds = alreadyTypeConstructors.map((x) => x.name)

  if (!kinds.includes(value.kind)) {
    throw new ElaborationError(
      `expect value to be type and to have kind: ${kinds}, instead of: ${value.kind}`
    )
  }
}
