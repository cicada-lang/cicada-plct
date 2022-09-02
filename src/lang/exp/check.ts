import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { checkByInfer, Exp } from "../exp"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { applyClosure, assertTypeInCtx, Value } from "../value"
import { conversion } from "../value/conversion"

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

    case "ObjektNull": {
      if (type.kind === "ClazzNull") {
        return Cores.ObjektNull()
      }

      assertTypeInCtx(ctx, type, Values.ClazzFulfilled)
      const rest = applyClosure(type.restClosure, type.property)
      return check(ctx, exp, rest)
    }

    case "ObjektCons": {
      if (type.kind === "ClazzFulfilled") {
        if (type.name === exp.name) {
          const propertyCore = check(ctx, exp.property, type.property)
          const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
          conversion(ctx, type.propertyType, propertyValue, type.property)
          const restType = applyClosure(type.restClosure, propertyValue)
          const restCore = check(ctx, exp.rest, restType)
          return Cores.ObjektCons(exp.name, exp.name, propertyCore, restCore)
        } else {
          const restType = applyClosure(type.restClosure, type.property)
          ctx = CtxCons(exp.name, type.propertyType, ctx)
          return check(ctx, exp.rest, restType)
        }
      }

      assertTypeInCtx(ctx, type, Values.ClazzCons)
      if (exp.name !== type.name) {
        throw new ElaborationError(
          `missing property: ${type.name}, in object: ${exp.name}`
        )
      }
      const propertyCore = check(ctx, exp.property, type.propertyType)
      const propertyValue = evaluate(ctxToEnv(ctx), propertyCore)
      ctx = CtxCons(exp.name, type.propertyType, ctx)
      const restType = applyClosure(type.restClosure, propertyValue)
      const restCore = check(ctx, exp.rest, restType)
      return Cores.ObjektCons(exp.name, exp.name, propertyCore, restCore)
    }

    default:
      throw new ElaborationError(
        `check is not implemented for exp: ${exp.kind}`
      )
  }
}
