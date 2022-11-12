import { checkByInfer, checkProperties } from "../check"
import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core } from "../core"
import { Ctx, CtxCons, ctxNames, ctxToEnv } from "../ctx"
import { evaluate } from "../evaluate"
import * as Exps from "../exp"
import { Exp, freeNames } from "../exp"
import { infer } from "../infer"
import { insertDuringCheck } from "../insert"
import { Mod } from "../mod"
import * as Neutrals from "../neutral"
import { freshen } from "../utils/freshen"
import * as Values from "../value"
import { Value } from "../value"

export function check(mod: Mod, ctx: Ctx, exp: Exp, type: Value): Core {
  switch (exp.kind) {
    case "Var": {
      {
        const { target, args } = Exps.unfoldAp(exp)
        const inferred = infer(mod, ctx, target)
        if (inferred.type.kind === "PiImplicit") {
          return insertDuringCheck(mod, ctx, inferred, args, type)
        }
      }

      return checkByInfer(mod, ctx, exp, type)
    }

    case "Pi":
    case "PiImplicit": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "PiUnfolded": {
      return check(mod, ctx, Exps.foldPi(exp.bindings, exp.retType), type)
    }

    case "Fn": {
      if (type.kind === "PiImplicit") {
        // NOTE Be careful about scope bug, the `freshName` might occurs in `exp`.
        const name = type.retTypeClosure.name
        const usedNames = [
          ...ctxNames(ctx),
          ...mod.solution.names,
          ...freeNames(new Set(), exp),
        ]
        const freshName = freshen(usedNames, name)
        const arg = Values.TypedNeutral(type.argType, Neutrals.Var(freshName))
        const retType = applyClosure(type.retTypeClosure, arg)
        const core = check(mod, ctx, exp, retType)
        return Cores.FnImplicit(freshName, core)
      }

      Values.assertTypeInCtx(mod, ctx, type, "Pi")
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(mod, ctx, exp.ret, retType)
      return Cores.Fn(exp.name, retCore)
    }

    case "FnImplicit": {
      Values.assertTypeInCtx(mod, ctx, type, "PiImplicit")
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(mod, ctx, exp.ret, retType)
      return Cores.FnImplicit(exp.name, retCore)
    }

    case "FnAnnotated": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "FnImplicitAnnotated": {
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

    case "Ap": {
      {
        const { target, args } = Exps.unfoldAp(exp)
        const inferred = infer(mod, ctx, target)
        if (inferred.type.kind === "PiImplicit") {
          return insertDuringCheck(mod, ctx, inferred, args, type)
        }
      }

      return checkByInfer(mod, ctx, exp, type)
    }

    case "ApImplicit": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "ApUnfolded": {
      return check(mod, ctx, Exps.foldAp(exp.target, exp.args), type)
    }

    case "Sigma": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "SigmaUnfolded": {
      return check(mod, ctx, Exps.foldSigma(exp.bindings, exp.cdrType), type)
    }

    case "Cons": {
      Values.assertTypeInCtx(mod, ctx, type, "Sigma")
      const { carType, cdrTypeClosure } = type
      const carCore = check(mod, ctx, exp.car, carType)
      const carValue = evaluate(ctxToEnv(ctx), carCore)
      const cdrTypeValue = applyClosure(cdrTypeClosure, carValue)
      const cdrCore = check(mod, ctx, exp.cdr, cdrTypeValue)
      return Cores.Cons(carCore, cdrCore)
    }

    case "Quote": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "ClazzUnfolded": {
      return check(mod, ctx, Exps.foldClazz(exp.bindings), type)
    }

    case "Objekt": {
      Values.assertClazzInCtx(mod, ctx, type)
      const properties = checkProperties(mod, ctx, exp.properties, type)
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

    case "SequenceLet":
    case "SequenceLetThe":
    case "SequenceCheck": {
      return checkByInfer(mod, ctx, exp, type)
    }

    case "SequenceUnfolded": {
      return check(mod, ctx, Exps.foldSequence(exp.bindings, exp.ret), type)
    }
  }
}
