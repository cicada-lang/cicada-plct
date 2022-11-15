import { Core } from "../core"

export function freeNames(boundNames: Set<string>, core: Core): Set<string> {
  switch (core.kind) {
    case "Var": {
      return boundNames.has(core.name) ? new Set() : new Set([core.name])
    }

    case "Pi": {
      return new Set([
        ...freeNames(boundNames, core.argType),
        ...freeNames(new Set([...boundNames, core.name]), core.retType),
      ])
    }

    case "PiImplicit": {
      return new Set([
        ...freeNames(boundNames, core.argType),
        ...freeNames(new Set([...boundNames, core.name]), core.retType),
      ])
    }

    case "Ap": {
      return new Set([
        ...freeNames(boundNames, core.target),
        ...freeNames(boundNames, core.arg),
      ])
    }

    case "ApImplicit": {
      return new Set([
        ...freeNames(boundNames, core.target),
        ...freeNames(boundNames, core.arg),
      ])
    }

    case "Fn": {
      return new Set([
        ...freeNames(new Set([...boundNames, core.name]), core.ret),
      ])
    }

    case "FnImplicit": {
      return new Set([
        ...freeNames(new Set([...boundNames, core.name]), core.ret),
      ])
    }

    case "Sigma": {
      return new Set([
        ...freeNames(boundNames, core.carType),
        ...freeNames(new Set([...boundNames, core.name]), core.cdrType),
      ])
    }

    case "Cons": {
      return new Set([
        ...freeNames(boundNames, core.car),
        ...freeNames(boundNames, core.cdr),
      ])
    }

    case "Car": {
      return new Set([...freeNames(boundNames, core.target)])
    }

    case "Cdr": {
      return new Set([...freeNames(boundNames, core.target)])
    }

    case "Quote": {
      return new Set()
    }

    case "ClazzNull": {
      return new Set()
    }

    case "ClazzCons": {
      return new Set([
        ...freeNames(boundNames, core.propertyType),
        ...freeNames(new Set([...boundNames, core.propertyName]), core.rest),
      ])
    }

    case "ClazzFulfilled": {
      return new Set([
        ...freeNames(boundNames, core.propertyType),
        ...freeNames(boundNames, core.property),
        ...freeNames(new Set([...boundNames, core.propertyName]), core.rest),
      ])
    }

    case "Objekt": {
      return new Set(
        Object.values(core.properties).flatMap((property) =>
          Array.from(freeNames(boundNames, property)),
        ),
      )
    }

    case "Dot": {
      return new Set([...freeNames(boundNames, core.target)])
    }

    case "Replace": {
      return new Set([
        ...freeNames(boundNames, core.target),
        ...freeNames(boundNames, core.motive),
        ...freeNames(boundNames, core.base),
      ])
    }
  }
}
