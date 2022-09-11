import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, CtxCons, ctxToEnv } from "../ctx"
// import { ElaborationError } from "../errors"
import { applyClosure } from "../closure"
import * as Exps from "../exp"
import { checkByInfer, checkProperties, Exp, infer } from "../exp"
import * as Neutrals from "../neutral"
import * as Values from "../value"
import { assertClazzInCtx, assertTypeInCtx, Value } from "../value"

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
      assertTypeInCtx(ctx, type, Values.Pi)
      const { argType, retTypeClosure } = type
      const argValue = Values.TypedNeutral(argType, Neutrals.Var(exp.name))
      const retTypeValue = applyClosure(retTypeClosure, argValue)
      ctx = CtxCons(exp.name, argType, ctx)
      const retCore = check(ctx, exp.ret, retTypeValue)
      return Cores.Fn(exp.name, retCore)
    }

    case "AnnotatedFn": {
      return checkByInfer(ctx, exp, type)
    }

    case "FoldedFn": {
      return check(ctx, Exps.unfoldFn(exp.bindings, exp.ret), type)
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
      return check(
        ctx,
        Exps.Objekt(Exps.prepareProperties(ctx, exp.properties)),
        type,
      )
    }

    case "Objekt": {
      assertClazzInCtx(ctx, type)

      const properties = checkProperties(ctx, exp.properties, type)

      /**
         Extra properties are not checked,
         thus we require that they are infer-able.
      **/

      const names = Object.keys(properties)
      const extraInferred = Object.entries(exp.properties)
        .filter(([name, exp]) => !names.includes(name))
        .map(([name, exp]): [string, Exps.Inferred] => [name, infer(ctx, exp)])
      const extraProperties = Object.fromEntries(
        extraInferred.map(([name, inferred]) => [name, inferred.core]),
      )

      return Cores.Objekt({ ...properties, ...extraProperties })
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

    // default: {
    //   throw new ElaborationError(
    //     `check is not implemented for exp: ${exp.kind}`,
    //   )
    // }
  }
}
