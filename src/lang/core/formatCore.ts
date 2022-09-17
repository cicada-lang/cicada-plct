import * as Cores from "../core"
import { Core } from "../core"
import { EvaluationError } from "../errors"
import { isIdentifier } from "../utils/isIdentifier"

export function formatCore(core: Core): string {
  switch (core.kind) {
    case "Var": {
      return core.name
    }

    case "Pi": {
      const { bindings, retType } = Cores.foldFormatPi(core)
      return `(${bindings.join(", ")}) -> ${retType}`
    }

    case "Fn": {
      const { bindings, ret } = Cores.foldFormatFn(core)
      return `(${bindings.join(", ")}) => ${ret}`
    }

    case "Ap": {
      const { target, args } = Cores.foldFormatAp(core)
      return `${target}(${args.join(", ")})`
    }

    case "Sigma": {
      const { bindings, cdrType } = Cores.foldFormatSigma(core)
      return `exists (${bindings.join(", ")}) ${cdrType}`
    }

    case "Cons": {
      return `cons(${formatCore(core.car)}, ${formatCore(core.cdr)})`
    }

    case "Car": {
      return `car(${formatCore(core.target)})`
    }

    case "Cdr": {
      return `cdr(${formatCore(core.target)})`
    }

    case "Quote": {
      return `"${core.literal}"`
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      const { bindings } = Cores.foldFormatClazz(core)
      return `class { ${bindings.join(", ")} }`
    }

    case "Objekt": {
      const properties = Object.entries(core.properties).map(
        ([name, property]) =>
          isIdentifier(name)
            ? `${name}: ${formatCore(property)}`
            : `"${name}": ${formatCore(property)}`,
      )

      return `{ ${properties.join(", ")} }`
    }

    case "Dot": {
      return `${formatCore(core.target)}.${core.name}`
    }

    default: {
      throw new EvaluationError(
        `formatCore is not implemented for ${core.kind}`,
      )
    }
  }
}
