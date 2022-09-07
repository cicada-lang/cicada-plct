import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { AlreadyType, Value } from "../value"

type AlreadyTypeConstructor = (...args: Array<any>) => AlreadyType

/**

   TODO Given the `ctx`, we have the opportunity to `readback` the `value` and print it in error report.

**/

type ElementReturnTypeUnion<T extends Array<AlreadyTypeConstructor>> =
  T extends (infer E extends AlreadyTypeConstructor)[] ? ReturnType<E> : never

export function assertTypesInCtx<T extends Array<AlreadyTypeConstructor>>(
  ctx: Ctx,
  value: Value,
  alreadyTypeConstructors: T,
): asserts value is ElementReturnTypeUnion<T> {
  const kinds = alreadyTypeConstructors.map((x) => x.name)

  if (!kinds.includes(value.kind)) {
    throw new ElaborationError(
      `expect value to be type and to have kind: ${kinds}, instead of: ${value.kind}`,
    )
  }
}
