import * as Exps from "../exp"

export function foldClazz(bindings: Array<Exps.ClazzBinding>): Exps.Clazz {
  if (bindings.length === 0) return Exps.ClazzNull()

  const [binding, ...restBindings] = bindings

  switch (binding.kind) {
    case "ClazzBindingAbstract": {
      return Exps.ClazzCons(binding.name, binding.propertyType, foldClazz(restBindings))
    }

    case "ClazzBindingFulfilled": {
      return Exps.ClazzFulfilled(
        binding.name,
        binding.propertyType,
        binding.property,
        foldClazz(restBindings),
      )
    }
  }
}
