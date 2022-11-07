import { Exp } from "../exp"

export function substExp(exp: Exp, name: string, arg: Exp): Exp {
  return exp
  // switch (exp.kind) {
  //   case "Var": {
  //     return boundNames.has(exp.name) ? new Set() : new Set([exp.name])
  //   }

  //   case "Pi": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.argType),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.retType),
  //     ])
  //   }

  //   case "PiImplicit": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.argType),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.retType),
  //     ])
  //   }

  //   case "PiUnfolded": {
  //     return freeNames(boundNames, Exps.foldPi(exp.bindings, exp.retType))
  //   }

  //   case "Ap": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.target),
  //       ...freeNames(boundNames, exp.arg),
  //     ])
  //   }

  //   case "ApImplicit": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.target),
  //       ...freeNames(boundNames, exp.arg),
  //     ])
  //   }

  //   case "ApUnfolded": {
  //     return freeNames(boundNames, Exps.foldAp(exp.target, exp.args))
  //   }

  //   case "Fn": {
  //     return new Set([
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
  //     ])
  //   }

  //   case "FnAnnotated": {
  //     return new Set([
  //       ...freeNames(new Set(boundNames), exp.argType),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
  //     ])
  //   }

  //   case "FnImplicit": {
  //     return new Set([
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
  //     ])
  //   }

  //   case "FnImplicitAnnotated": {
  //     return new Set([
  //       ...freeNames(new Set(boundNames), exp.argType),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
  //     ])
  //   }

  //   case "FnUnfolded": {
  //     return freeNames(boundNames, Exps.foldFn(exp.bindings, exp.ret))
  //   }

  //   case "FnUnfoldedWithRetType": {
  //     return freeNames(
  //       boundNames,
  //       Exps.foldFnWithRetType(exp.bindings, exp.retType, exp.ret),
  //     )
  //   }

  //   case "Sigma": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.carType),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.cdrType),
  //     ])
  //   }

  //   case "SigmaUnfolded": {
  //     return freeNames(boundNames, Exps.foldSigma(exp.bindings, exp.cdrType))
  //   }

  //   case "Cons": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.car),
  //       ...freeNames(boundNames, exp.cdr),
  //     ])
  //   }

  //   case "Quote": {
  //     return new Set()
  //   }

  //   case "ClazzNull": {
  //     return new Set()
  //   }

  //   case "ClazzCons": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.propertyType),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.rest),
  //     ])
  //   }

  //   case "ClazzFulfilled": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.propertyType),
  //       ...freeNames(boundNames, exp.property),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.rest),
  //     ])
  //   }

  //   case "ClazzUnfolded": {
  //     return freeNames(boundNames, Exps.foldClazz(exp.bindings))
  //   }

  //   case "Objekt": {
  //     return new Set(
  //       Object.values(exp.properties).flatMap((property) =>
  //         Array.from(freeNames(boundNames, property)),
  //       ),
  //     )
  //   }

  //   case "ObjektUnfolded": {
  //     return new Set(
  //       exp.properties.flatMap((property) =>
  //         Array.from(freeNames(boundNames, property.exp)),
  //       ),
  //     )
  //   }

  //   case "New": {
  //     return new Set(
  //       Object.values(exp.properties).flatMap((property) =>
  //         Array.from(freeNames(boundNames, property)),
  //       ),
  //     )
  //   }

  //   case "NewUnfolded": {
  //     return new Set(
  //       exp.properties.flatMap((property) =>
  //         Array.from(freeNames(boundNames, property.exp)),
  //       ),
  //     )
  //   }

  //   case "NewAp": {
  //     return new Set(
  //       exp.args.flatMap((arg) => Array.from(freeNames(boundNames, arg.exp))),
  //     )
  //   }

  //   case "Dot": {
  //     return new Set([...freeNames(boundNames, exp.target)])
  //   }

  //   case "SequenceLet": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.exp),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
  //     ])
  //   }

  //   case "SequenceLetThe": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.exp),
  //       ...freeNames(boundNames, exp.type),
  //       ...freeNames(new Set([...boundNames, exp.name]), exp.ret),
  //     ])
  //   }

  //   case "SequenceCheck": {
  //     return new Set([
  //       ...freeNames(boundNames, exp.exp),
  //       ...freeNames(boundNames, exp.type),
  //       ...freeNames(boundNames, exp.ret),
  //     ])
  //   }

  //   case "SequenceUnfolded": {
  //     return freeNames(boundNames, Exps.foldSequence(exp.bindings, exp.ret))
  //   }
  // }
}
