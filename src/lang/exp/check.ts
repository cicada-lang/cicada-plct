import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import * as Exps from "../exp"
import { checkByInfer, checkProperties, Exp } from "../exp"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import {
  applyClosure,
  assertClazzInCtx,
  assertTypeInCtx,
  Value,
} from "../value"

export function check(ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var": {
      return checkByInfer(ctx, exp, type)
    }

    case "Pi":
    case "FoldedPi": {
      return checkByInfer(ctx, exp, type)
    }

    case "FoldedFn": {
      return check(ctx, Exps.unfoldFn(exp.bindings, exp.ret), type)
    }

    case "Fn": {
      assertTypeInCtx(ctx, type, Values.Pi)
      const { argType, retTypeClosure } = type
      const argValue = Values.TypedNeutral(argType, Neutrals.Var(exp.name))
      const retTypeValue = applyClosure(retTypeClosure, argValue)
      ctx = CtxCons(exp.name, argType, ctx)
      const retCore = check(ctx, exp.ret, retTypeValue)
      return Cores.Fn(exp.name, retCore)
    }

    case "Ap":
    case "FoldedAp": {
      return checkByInfer(ctx, exp, type)
    }

    case "Sigma":
    case "FoldedSigma": {
      return checkByInfer(ctx, exp, type)
    }

    case "Cons": {
      assertTypeInCtx(ctx, type, Values.Sigma)
      const { carType, cdrTypeClosure } = type
      const carCore = check(ctx, exp.car, carType)
      const carValue = evaluate(ctxToEnv(ctx), carCore)
      const cdrTypeValue = applyClosure(cdrTypeClosure, carValue)
      const cdrCore = check(ctx, exp.cdr, cdrTypeValue)
      return Cores.Cons(carCore, cdrCore)
    }

    case "Car":
    case "Cdr": {
      return checkByInfer(ctx, exp, type)
    }

    case "Quote": {
      return checkByInfer(ctx, exp, type)
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled":
    case "FoldedClazz": {
      return checkByInfer(ctx, exp, type)
    }

    case "FoldedObjekt": {
      Exps.assertNoDuplicateProperties(ctx, exp.properties)
      return check(ctx, Exps.unfoldObjekt(exp.properties), type)
    }

    case "Objekt": {
      assertClazzInCtx(ctx, type)

      const properties = checkProperties(ctx, exp.properties, type)

      /**
         TODO We disallow extra property for now.
         We might `infer` the properties that are not checked.
         This require us to handle off-order `Values.Clazz` in `inclusion`.
       **/

      Exps.disallowExtraProperty(ctx, properties, exp.properties)

      return Cores.Objekt(properties)
    }

    case "Dot": {
      return checkByInfer(ctx, exp, type)
    }

    // default: {
    //   throw new ElaborationError(
    //     `check is not implemented for exp: ${exp.kind}`
    //   )
    // }
  }
}
