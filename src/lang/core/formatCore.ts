import { EvaluationError } from "../errors"
import { Core } from "./Core"

export function formatCore(core: Core): string {
  switch (core.kind) {
    case "Var": {
      return core.name
    }

    case "Pi": {
      const { bindings, retType } = foldPi(core)
      return `(${bindings.join(", ")}) -> ${retType}`
    }

    case "Fn": {
      const { bindings, ret } = foldFn(core)
      return `(${bindings.join(", ")}) => ${ret}`
    }

    case "Ap": {
      const { target, args } = foldAp(core)
      return `${target}(${args.join(", ")})`
    }

    case "Sigma": {
      const { bindings, cdr } = foldSigma(core)
      return `exists (${bindings.join(", ")}) ${cdr}`
    }

    case "Quote": {
      return `"${core.literal}"`
    }

    default: {
      throw new EvaluationError(
        `formatCore is not implemented for ${core.kind}`
      )
    }
  }
}

function foldPi(core: Core): { bindings: Array<string>; retType: string } {
  switch (core.kind) {
    case "Pi": {
      const argType = formatCore(core.argType)
      const binding = `${core.name}: ${argType}`
      const { bindings, retType } = foldPi(core.retType)
      return { bindings: [binding, ...bindings], retType }
    }

    default: {
      return { bindings: [], retType: formatCore(core) }
    }
  }
}

function foldFn(core: Core): { bindings: Array<string>; ret: string } {
  switch (core.kind) {
    case "Fn": {
      const binding = `${core.name}`
      const { bindings, ret } = foldFn(core.ret)
      return { bindings: [binding, ...bindings], ret }
    }

    default: {
      return { bindings: [], ret: formatCore(core) }
    }
  }
}

function foldAp(core: Core): { target: string; args: Array<string> } {
  switch (core.kind) {
    case "Ap": {
      const arg = formatCore(core.arg)
      const { target, args } = foldAp(core.target)
      return { target, args: [...args, arg] }
    }

    default: {
      return { target: formatCore(core), args: [] }
    }
  }
}

function foldSigma(core: Core): { bindings: Array<string>; cdr: string } {
  switch (core.kind) {
    case "Sigma": {
      const car = formatCore(core.carType)
      const { bindings, cdr } = foldSigma(core.cdrType)
      return { bindings: [car, ...bindings], cdr }
    }

    default: {
      return { bindings: [], cdr: formatCore(core) }
    }
  }
}
