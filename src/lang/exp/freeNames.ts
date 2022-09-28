import * as Exps from "../exp"
import { Exp } from "../exp"

export function freeNames(boundNames: Set<string>, exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Var": {
      return boundNames.has(exp.name) ? new Set() : new Set([exp.name])
    }

    case "Pi": {
      return new Set([
        ...freeNames(boundNames, exp.argType),
        ...freeNames(new Set([...boundNames, exp.name]), exp.retType),
      ])
    }

    case "PiImplicit": {
      return new Set([
        ...freeNames(boundNames, exp.argType),
        ...freeNames(new Set([...boundNames, exp.name]), exp.retType),
      ])
    }

    case "PiUnfolded": {
      return freeNames(boundNames, Exps.foldPi(exp.bindings, exp.retType))
    }

    case "Ap": {
      return new Set([
        ...freeNames(boundNames, exp.target),
        ...freeNames(boundNames, exp.arg),
      ])
    }

    case "ApImplicit": {
      return new Set([
        ...freeNames(boundNames, exp.target),
        ...freeNames(boundNames, exp.arg),
      ])
    }

    case "ApUnfolded": {
      return freeNames(boundNames, Exps.foldAp(exp.target, exp.args))
    }

    case "Fn": {
      return new Set([
        ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
      ])
    }

    case "FnAnnotated": {
      return new Set([
        ...freeNames(new Set(boundNames), exp.argType),
        ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
      ])
    }

    case "FnImplicit": {
      return new Set([
        ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
      ])
    }

    case "FnImplicitAnnotated": {
      return new Set([
        ...freeNames(new Set(boundNames), exp.argType),
        ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
      ])
    }

    case "FnUnfolded": {
      return freeNames(boundNames, Exps.foldFn(exp.bindings, exp.ret))
    }

    case "FnUnfoldedWithRetType": {
      return freeNames(
        boundNames,
        Exps.foldFnWithRetType(exp.bindings, exp.retType, exp.ret),
      )
    }

    case "Sigma": {
      return new Set([
        ...freeNames(boundNames, exp.carType),
        ...freeNames(new Set([...boundNames, exp.name]), exp.cdrType),
      ])
    }

    case "SigmaUnfolded": {
      return freeNames(boundNames, Exps.foldSigma(exp.bindings, exp.cdrType))
    }

    case "Cons": {
      return new Set([
        ...freeNames(boundNames, exp.car),
        ...freeNames(boundNames, exp.cdr),
      ])
    }

    case "Car": {
      return new Set([...freeNames(boundNames, exp.target)])
    }

    case "Cdr": {
      return new Set([...freeNames(boundNames, exp.target)])
    }

    case "Quote": {
      return new Set()
    }

    case "ClazzNull": {
      return new Set()
    }

    case "ClazzCons": {
      // TODO
      return new Set()
    }

    case "ClazzFulfilled": {
      // TODO
      return new Set()
    }

    case "ClazzUnfolded": {
      // TODO
      return new Set()
    }

    case "Objekt": {
      return new Set(
        Object.values(exp.properties).flatMap((property) =>
          Array.from(freeNames(boundNames, property)),
        ),
      )
    }

    case "ObjektUnfolded": {
      return new Set(
        exp.properties.flatMap((property) =>
          Array.from(freeNames(boundNames, property.exp)),
        ),
      )
    }

    case "New": {
      // TODO
      return new Set()
    }

    case "NewUnfolded": {
      // TODO
      return new Set()
    }

    case "NewAp": {
      // TODO
      return new Set()
    }

    case "Dot": {
      return new Set([...freeNames(boundNames, exp.target)])
    }

    case "SequenceLet": {
      // TODO
      return new Set()
    }

    case "SequenceLetThe": {
      // TODO
      return new Set()
    }

    case "SequenceCheck": {
      // TODO
      return new Set()
    }

    case "SequenceUnfolded": {
      // TODO
      return new Set()
    }
  }
}
