import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons } from "../ctx"
import * as Errors from "../errors"
import * as Exps from "../exp"
import { Exp } from "../exp"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { Value } from "../value"

export function check(mod: Mod, ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var": {
      return Exps.checkVar(mod, ctx, exp, type)
    }

    case "Pi":
    case "PiImplicit": {
      return Exps.checkByInfer(mod, ctx, exp, type)
    }

    case "PiUnfolded": {
      return check(mod, ctx, Exps.foldPi(exp.bindings, exp.retType), type)
    }

    case "Fn": {
      if (Values.isValue(type, "PiImplicit")) {
        const name = type.retTypeClosure.name
        const arg = Values.TypedNeutral(type.argType, Neutrals.Var(name))
        const retType = applyClosure(type.retTypeClosure, arg)
        const core = check(mod, ctx, exp, retType)
        return Cores.FnImplicit(name, core)
      }

      Values.assertTypeInCtx(ctx, type, "Pi")
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(mod, ctx, exp.ret, retType)
      return Cores.Fn(exp.name, retCore)
    }

    case "FnImplicit": {
      Values.assertTypeInCtx(ctx, type, "PiImplicit")
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(mod, ctx, exp.ret, retType)
      return Cores.FnImplicit(exp.name, retCore)
    }

    case "FnAnnotated": {
      return Exps.checkByInfer(mod, ctx, exp, type)
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
    case "ApImplicit": {
      return Exps.checkByInfer(mod, ctx, exp, type)
    }

    case "ApUnfolded": {
      return check(mod, ctx, Exps.foldAp(exp.target, exp.args), type)
    }

    case "Sigma": {
      return Exps.checkByInfer(mod, ctx, exp, type)
    }

    case "SigmaUnfolded": {
      return check(mod, ctx, Exps.foldSigma(exp.bindings, exp.cdrType), type)
    }

    case "Cons": {
      Values.assertTypeInCtx(ctx, type, "Sigma")
      const { carType, cdrTypeClosure } = type
      const carCore = check(mod, ctx, exp.car, carType)
      const carValue = evaluate(mod.ctxToEnv(ctx), carCore)
      const cdrTypeValue = applyClosure(cdrTypeClosure, carValue)
      const cdrCore = check(mod, ctx, exp.cdr, cdrTypeValue)
      return Cores.Cons(carCore, cdrCore)
    }

    case "Quote": {
      return Exps.checkByInfer(mod, ctx, exp, type)
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return Exps.checkByInfer(mod, ctx, exp, type)
    }

    case "ClazzUnfolded": {
      return check(mod, ctx, Exps.foldClazz(exp.bindings), type)
    }

    case "Objekt": {
      Values.assertClazzInCtx(ctx, type)
      const properties = Exps.checkProperties(mod, ctx, exp.properties, type)
      return Cores.Objekt(properties)
    }

    case "ObjektUnfolded": {
      return check(
        mod,
        ctx,
        Exps.Objekt(Exps.prepareProperties(mod, ctx, exp.properties)),
        type,
      )
    }

    case "Dot": {
      return Exps.checkByInfer(mod, ctx, exp, type)
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
      return Exps.checkByInfer(mod, ctx, exp, type)
    }

    case "SequenceLet":
    case "SequenceLetThe":
    case "SequenceCheck": {
      return Exps.checkByInfer(mod, ctx, exp, type)
    }

    case "SequenceUnfolded": {
      return check(mod, ctx, Exps.foldSequence(exp.bindings, exp.ret), type)
    }

    default: {
      throw new Errors.ElaborationError(
        `check is not implemented for exp: ${exp.kind}`,
        {
          span: exp.span,
        },
      )
    }
  }
}
