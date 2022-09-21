import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { checkByInfer, enrich, Exp } from "../exp"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { Value } from "../value"

export function check(mod: Mod, ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "Pi":
    case "PiUnfolded": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "Fn": {
      Values.assertTypeInCtx(ctx, type, Values.Pi)
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(mod, ctx, exp.ret, retType)
      return Cores.Fn(exp.name, retCore)
    }

    case "FnImplicit": {
      Values.assertTypeInCtx(ctx, type, Values.PiImplicit)
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(mod, ctx, exp.ret, retType)
      return Cores.FnImplicit(exp.name, retCore)
    }

    case "FnAnnotated": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "FnUnfolded": {
      return check(mod, ctx, Exps.foldFn(exp.bindings, exp.ret), type)
    }

    case "FnUnfoldedWithRetType": {
      return check(
        mod,
        ctx,
        Exps.foldFnWithRetType(exp.bindings, exp.retType, exp.ret),
        type,
      )
    }

    case "Ap":
    case "ApUnfolded": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "Sigma":
    case "SigmaUnfolded": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "Cons": {
      Values.assertTypeInCtx(ctx, type, Values.Sigma)
      const { carType, cdrTypeClosure } = type
      const carCore = check(mod, ctx, exp.car, carType)
      const carValue = evaluate(mod.solution.enrichCtx(mod, ctx), carCore)
      const cdrTypeValue = applyClosure(cdrTypeClosure, carValue)
      const cdrCore = check(mod, ctx, exp.cdr, cdrTypeValue)
      return Cores.Cons(carCore, cdrCore)
    }

    case "Car":
    case "Cdr": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "Quote": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled":
    case "ClazzUnfolded": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "ObjektUnfolded":
    case "Objekt": {
      const { core } = enrich(mod, ctx, exp, type)
      return core
    }

    case "Dot": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "NewUnfolded": {
      return check(
        mod,
        ctx,
        Exps.New(exp.name, Exps.prepareProperties(mod, ctx, exp.properties)),
        type,
      )
    }

    case "New":
    case "NewAp": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "SequenceUnfolded":
    case "SequenceLet":
    case "SequenceLetThe":
    case "SequenceCheck": {
      return checkByInfer(mod, ctx, exp, type)
    }

    default: {
      throw new ElaborationError(
        `check is not implemented for exp: ${exp.kind}`,
      )
    }
  }
}
