import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { checkByInfer, enrich, Exp } from "../exp"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { Value } from "../value"

export function check(ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var": {
      return checkByInfer(ctx, exp, type)
    }

    case "Pi":
    case "FoldedPi": {
      return checkByInfer(ctx, exp, type)
    }

    case "Fn": {
      Values.assertTypeInCtx(ctx, type, Values.Pi)
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(ctx, exp.ret, retType)
      return Cores.Fn(exp.name, retCore)
    }

    case "ImplicitFn": {
      Values.assertTypeInCtx(ctx, type, Values.ImplicitPi)
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(ctx, exp.ret, retType)
      return Cores.ImplicitFn(exp.name, retCore)
    }

    case "AnnotatedFn": {
      return checkByInfer(ctx, exp, type)
    }

    case "FoldedFn": {
      return check(ctx, Exps.unfoldFn(exp.bindings, exp.ret), type)
    }

    case "FoldedFnWithRetType": {
      return check(
        ctx,
        Exps.unfoldFnWithRetType(exp.bindings, exp.retType, exp.ret),
        type,
      )
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
      Values.assertTypeInCtx(ctx, type, Values.Sigma)
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

    case "FoldedObjekt":
    case "Objekt": {
      const { core } = enrich(ctx, exp, type)
      return core
    }

    case "Dot": {
      return checkByInfer(ctx, exp, type)
    }

    case "FoldedNew": {
      return check(
        ctx,
        Exps.New(exp.name, Exps.prepareProperties(ctx, exp.properties)),
        type,
      )
    }

    case "New":
    case "NewAp": {
      return checkByInfer(ctx, exp, type)
    }

    case "FoldedSequence":
    case "SequenceLet":
    case "SequenceLetThe":
    case "SequenceCheck": {
      return checkByInfer(ctx, exp, type)
    }

    default: {
      throw new ElaborationError(
        `check is not implemented for exp: ${exp.kind}`,
      )
    }
  }
}
