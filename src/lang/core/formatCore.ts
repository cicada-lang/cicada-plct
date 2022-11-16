import { indent } from "../../utils/indent"
import type { Core } from "../core"
import * as Cores from "../core"
import { isIdentifier } from "../utils/isIdentifier"

export function formatCore(core: Core): string {
  switch (core.kind) {
    case "Var": {
      return core.name
    }

    case "MetaVar": {
      return "?" + core.name
    }

    case "Pi":
    case "PiImplicit": {
      const { bindings, retType } = Cores.unfoldFormatPi(core)
      return `${formatArgs(bindings)} -> ${retType}`
    }

    case "Fn":
    case "FnImplicit": {
      const { bindings, ret } = Cores.unfoldFormatFn(core)
      return `${formatArgs(bindings)} => ${ret}`
    }

    case "Ap":
    case "ApImplicit": {
      const { target, args } = Cores.unfoldFormatAp(core)
      return `${target}${formatArgs(args)}`
    }

    case "Sigma": {
      if (Cores.freeOccurred(core.name, core.cdrType)) {
        const { bindings, cdrType } = Cores.unfoldFormatSigma(core)
        return `exists ${formatArgs(bindings)} ${cdrType}`
      } else {
        const args = formatArgs([
          formatCore(core.carType),
          formatCore(core.cdrType),
        ])
        return `Pair${args}`
      }
    }

    case "Cons": {
      const args = formatArgs([formatCore(core.car), formatCore(core.cdr)])
      return `cons${args}`
    }

    case "Car": {
      const args = formatArgs([formatCore(core.target)])
      return `car${args}`
    }

    case "Cdr": {
      const args = formatArgs([formatCore(core.target)])
      return `cdr${args}`
    }

    case "Quote": {
      return `"${core.data}"`
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      const { bindings } = Cores.unfoldFormatClazz(core)
      return core.name
        ? `class ${core.name} {\n${indent(bindings.join("\n"))}\n}`
        : `class {\n${indent(bindings.join("\n"))}\n}`
    }

    case "Objekt": {
      const properties = Object.entries(core.properties).map(
        ([name, property]) =>
          isIdentifier(name)
            ? `${name}: ${formatCore(property)}`
            : `"${name}": ${formatCore(property)}`,
      )

      return `{\n${indent(properties.join(",\n"))}\n}`
    }

    case "Dot": {
      return `${formatCore(core.target)}.${core.name}`
    }

    case "Replace": {
      const target = formatCore(core.target)
      const motive = formatCore(core.motive)
      const base = formatCore(core.base)
      const args = formatArgs([target, motive, base])
      return `replace${args}`
    }
  }
}

function isLargeArgs(args: Array<string>): boolean {
  return args.some((arg) => arg.includes("\n")) || args.join(", ").length >= 60
}

function formatArgs(args: Array<string>): string {
  if (isLargeArgs(args)) {
    return `(\n${args.map((arg) => indent(arg) + ",").join("\n")}\n)`
  } else {
    return `(${args.join(", ")})`
  }
}
