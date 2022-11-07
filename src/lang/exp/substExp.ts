import * as Exps from "../exp"
import { Exp } from "../exp"
import { freshen } from "../utils/freshen"

export function substExp(body: Exp, name: string, exp: Exp): Exp {
  switch (body.kind) {
    case "Var": {
      if (body.name === name) {
        return exp
      } else {
        return body
      }
    }

    case "Pi": {
      if (body.name === name) {
        return Exps.Pi(
          body.name,
          substExp(body.argType, name, exp),
          body.retType,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const retType = substExp(body.retType, body.name, Exps.Var(freshName))
        return Exps.Pi(
          body.name,
          substExp(body.argType, name, exp),
          substExp(retType, name, exp),
          body.span,
        )
      }
    }

    case "PiImplicit": {
      if (body.name === name) {
        return Exps.PiImplicit(
          body.name,
          substExp(body.argType, name, exp),
          body.retType,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const retType = substExp(body.retType, body.name, Exps.Var(freshName))
        return Exps.PiImplicit(
          body.name,
          substExp(body.argType, name, exp),
          substExp(retType, name, exp),
          body.span,
        )
      }
    }

    case "PiUnfolded": {
      return substExp(Exps.foldPi(body.bindings, body.retType), name, exp)
    }

    case "Ap": {
      return Exps.Ap(
        substExp(body.target, name, exp),
        substExp(body.arg, name, exp),
        body.span,
      )
    }

    case "ApImplicit": {
      return Exps.ApImplicit(
        substExp(body.target, name, exp),
        substExp(body.arg, name, exp),
        body.span,
      )
    }

    case "ApUnfolded": {
      return substExp(Exps.foldAp(body.target, body.args), name, exp)
    }

    case "Fn": {
      if (body.name === name) {
        return body
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.Fn(body.name, substExp(ret, name, exp), body.span)
      }
    }

    case "FnAnnotated": {
      if (body.name === name) {
        return Exps.FnAnnotated(
          body.name,
          substExp(body.argType, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnAnnotated(
          body.name,
          substExp(body.argType, name, exp),
          substExp(ret, name, exp),
          body.span,
        )
      }
    }

    case "FnImplicit": {
      if (body.name === name) {
        return body
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnImplicit(body.name, substExp(ret, name, exp), body.span)
      }
    }

    case "FnImplicitAnnotated": {
      if (body.name === name) {
        return Exps.FnImplicitAnnotated(
          body.name,
          substExp(body.argType, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const ret = substExp(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnImplicitAnnotated(
          body.name,
          substExp(body.argType, name, exp),
          substExp(ret, name, exp),
          body.span,
        )
      }
    }

    case "FnUnfolded": {
      return substExp(Exps.foldFn(body.bindings, body.ret), name, exp)
    }

    case "FnUnfoldedWithRetType": {
      return substExp(
        Exps.foldFnWithRetType(body.bindings, body.retType, body.ret),
        name,
        exp,
      )
    }

    case "Sigma": {
      if (body.name === name) {
        return Exps.Sigma(
          body.name,
          substExp(body.carType, name, exp),
          body.cdrType,
          body.span,
        )
      } else {
        const freeNames = Exps.freeNames(Exps.freeNames(new Set(), body), exp)
        const freshName = freshen(freeNames, body.name)
        const cdrType = substExp(body.cdrType, body.name, Exps.Var(freshName))
        return Exps.Sigma(
          body.name,
          substExp(body.carType, name, exp),
          substExp(cdrType, name, exp),
          body.span,
        )
      }
    }

    case "SigmaUnfolded": {
      return substExp(Exps.foldSigma(body.bindings, body.cdrType), name, exp)
    }

    case "Cons": {
      return Exps.Cons(
        substExp(body.car, name, exp),
        substExp(body.cdr, name, exp),
        body.span,
      )
    }

    case "Quote": {
      return body
    }

    case "ClazzNull": {
      return body
    }

    // case "ClazzCons": {
    //   return new Set([
    //     ...freeNames(boundNames, exp.propertyType),
    //     ...freeNames(new Set([...boundNames, exp.name]), exp.rest),
    //   ])
    // }

    // case "ClazzFulfilled": {
    //   return new Set([
    //     ...freeNames(boundNames, exp.propertyType),
    //     ...freeNames(boundNames, exp.property),
    //     ...freeNames(new Set([...boundNames, exp.name]), exp.rest),
    //   ])
    // }

    case "ClazzUnfolded": {
      return substExp(Exps.foldClazz(body.bindings), name, exp)
    }

    // case "Objekt": {
    //   return new Set(
    //     Object.values(exp.properties).flatMap((property) =>
    //       Array.from(freeNames(boundNames, property)),
    //     ),
    //   )
    // }

    // case "ObjektUnfolded": {
    //   return new Set(
    //     exp.properties.flatMap((property) =>
    //       Array.from(freeNames(boundNames, property.exp)),
    //     ),
    //   )
    // }

    // case "New": {
    //   return new Set(
    //     Object.values(exp.properties).flatMap((property) =>
    //       Array.from(freeNames(boundNames, property)),
    //     ),
    //   )
    // }

    // case "NewUnfolded": {
    //   return new Set(
    //     exp.properties.flatMap((property) =>
    //       Array.from(freeNames(boundNames, property.exp)),
    //     ),
    //   )
    // }

    // case "NewAp": {
    //   return new Set(
    //     exp.args.flatMap((arg) => Array.from(freeNames(boundNames, arg.exp))),
    //   )
    // }

    // case "Dot": {
    //   return new Set([...freeNames(boundNames, exp.target)])
    // }

    // case "SequenceLet": {
    //   return new Set([
    //     ...freeNames(boundNames, exp.exp),
    //     ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
    //   ])
    // }

    // case "SequenceLetThe": {
    //   return new Set([
    //     ...freeNames(boundNames, exp.exp),
    //     ...freeNames(boundNames, exp.type),
    //     ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
    //   ])
    // }

    // case "SequenceCheck": {
    //   return new Set([
    //     ...freeNames(boundNames, exp.exp),
    //     ...freeNames(boundNames, exp.type),
    //     ...freeNames(boundNames, exp.ret),
    //   ])
    // }

    case "SequenceUnfolded": {
      return substExp(Exps.foldSequence(body.bindings, body.ret), name, exp)
    }

    default: {
      return body
    }
  }
}
