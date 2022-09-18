import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { checkByInfer, enrich, Exp } from "../exp"
import * as Neutrals from "../neutral"
import { Solution } from "../solution"
import * as Values from "../value"
import { Value } from "../value"

export function check(
  solution: Solution,
  ctx: Ctx,
  exp: Exp,
  type: Value,
): Core {
  switch (exp.kind) {
    case "Var": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "Pi":
    case "FoldedPi": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "Fn": {
      /**
         `ImplicitFn` insertion.
       **/
      if (Values.isValue(type, Values.ImplicitPi)) {
        return Exps.insertImplicitFn(solution, ctx, exp, type)
      }

      Values.assertTypeInCtx(ctx, type, Values.Pi)
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(solution, ctx, exp.ret, retType)
      return Cores.Fn(exp.name, retCore)
    }

    case "ImplicitFn": {
      /**
         TODO We can also insert `ImplicitFn` when
         the number of implicits in `ImplicitPi` is greater than
         the number of implicits in `ImplicitFn`.
      **/

      Values.assertTypeInCtx(ctx, type, Values.ImplicitPi)
      const arg = Values.TypedNeutral(type.argType, Neutrals.Var(exp.name))
      const retType = applyClosure(type.retTypeClosure, arg)
      ctx = CtxCons(exp.name, type.argType, ctx)
      const retCore = check(solution, ctx, exp.ret, retType)
      return Cores.ImplicitFn(exp.name, retCore)
    }

    case "AnnotatedFn": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "FoldedFn": {
      return check(solution, ctx, Exps.unfoldFn(exp.bindings, exp.ret), type)
    }

    case "FoldedFnWithRetType": {
      return check(
        solution,
        ctx,
        Exps.unfoldFnWithRetType(exp.bindings, exp.retType, exp.ret),
        type,
      )
    }

    case "Ap":
    case "FoldedAp": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "Sigma":
    case "FoldedSigma": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "Cons": {
      Values.assertTypeInCtx(ctx, type, Values.Sigma)
      const { carType, cdrTypeClosure } = type
      const carCore = check(solution, ctx, exp.car, carType)
      const carValue = evaluate(solution, ctxToEnv(ctx), carCore)
      const cdrTypeValue = applyClosure(cdrTypeClosure, carValue)
      const cdrCore = check(solution, ctx, exp.cdr, cdrTypeValue)
      return Cores.Cons(carCore, cdrCore)
    }

    case "Car":
    case "Cdr": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "Quote": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "ClazzNull":
    case "ClazzCons":
    case "ClazzFulfilled":
    case "FoldedClazz": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "FoldedObjekt":
    case "Objekt": {
      const { core } = enrich(solution, ctx, exp, type)
      return core
    }

    case "Dot": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "FoldedNew": {
      return check(
        solution,
        ctx,
        Exps.New(
          exp.name,
          Exps.prepareProperties(solution, ctx, exp.properties),
        ),
        type,
      )
    }

    case "New":
    case "NewAp": {
      return checkByInfer(solution, ctx, exp, type)
    }

    case "FoldedSequence":
    case "SequenceLet":
    case "SequenceLetThe":
    case "SequenceCheck": {
      return checkByInfer(solution, ctx, exp, type)
    }

    default: {
      throw new ElaborationError(
        `check is not implemented for exp: ${exp.kind}`,
      )
    }
  }
}
