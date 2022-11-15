import * as Exps from "../exp"
import { spanUnion } from "../span"

export function foldClazz(
  bindings: Array<Exps.ClazzBinding>,
  name?: string,
): Exps.Clazz {
  if (bindings.length === 0) return Exps.ClazzNull()

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "ClazzBindingAbstract": {
      return Exps.ClazzCons(
        binding.name,
        binding.name,
        binding.propertyType,
        // NOTE Only the top has the `name`.
        foldClazz(restBindings, undefined),
        name,
        binding.propertyType.span,
      )
    }

    case "ClazzBindingFulfilled": {
      return Exps.ClazzFulfilled(
        binding.name,
        binding.name,
        binding.propertyType,
        binding.property,
        // NOTE Only the top has the `name`.
        foldClazz(restBindings, undefined),
        name,
        spanUnion(binding.propertyType.span, binding.property.span),
      )
    }
  }
}
