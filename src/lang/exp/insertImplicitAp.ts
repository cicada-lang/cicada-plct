import { applyClosure } from "../closure"
import * as Cores from "../core"
import { Core, evaluate } from "../core"
import { Ctx, ctxToEnv, lookupTypeInCtx } from "../ctx"
import { ElaborationError } from "../errors"
import * as Exps from "../exp"
import { check, Inferred } from "../exp"
import {
  deepWalk,
  lookupValueInSolution,
  PatternVar,
  Solution,
  SolutionNull,
  solveType,
} from "../solution"
import * as Values from "../value"
import { readback, Value } from "../value"

export function insertImplicitAp(
  ctx: Ctx,
  type: Value,
  target: Core,
  args: Array<Exps.Arg>,
): Inferred {
  const inserter = new ImplicitApInserter(ctx, type, target, args)
  return inserter.insert()
}

class ImplicitApInserter {
  patternVars: Array<PatternVar>
  solution: Solution = SolutionNull()
  passedArgs: Array<Core> = []
  type: Value
  ctx: Ctx

  constructor(
    ctx: Ctx,
    type: Value,
    public target: Core,
    public args: Array<Exps.Arg>,
  ) {
    const collected = Exps.collectPatternVars(ctx, type)
    this.patternVars = collected.patternVars
    this.type = collected.type
    this.ctx = collected.ctx
  }

  insert(): Inferred {
    this.solvePatternVars()
    this.type = deepWalk(this.solution, this.type)
    let inferred = Inferred(this.type, this.target)
    inferred = this.insertPatternVars(inferred)
    inferred = this.insertPassedArgs(inferred)
    inferred = this.insertArgs(inferred)
    return inferred
  }

  private solvePatternVars(): void {
    while (this.args[0]?.kind === "ArgPlain") {
      const arg = this.args[0]
      const argInferred = Exps.inferOrUndefined(this.ctx, arg.exp)

      /**
         TODO We also need to handle `Values.ImplicitPi`.
      **/

      Values.assertTypeInCtx(this.ctx, this.type, Values.Pi)

      if (argInferred !== undefined) {
        this.solution = solveType(
          this.solution,
          this.ctx,
          argInferred.type,
          this.type.argType,
        )
      }

      /**
         TODO Do we need to call `deepWalk` here?
      **/

      const argCore = argInferred
        ? argInferred.core
        : check(this.ctx, arg.exp, this.type.argType)

      const argValue = evaluate(ctxToEnv(this.ctx), argCore)
      this.type = applyClosure(this.type.retTypeClosure, argValue)
      this.passedArgs.push(argCore)
      this.args.shift()
    }
  }

  private insertPatternVars(inferred: Inferred): Inferred {
    for (const patternVar of this.patternVars) {
      inferred = this.insertPatternVar(inferred, patternVar)
    }

    return inferred
  }

  private insertPatternVar(
    inferred: Inferred,
    patternVar: PatternVar,
  ): Inferred {
    let argValue = lookupValueInSolution(this.solution, patternVar.neutral.name)
    if (argValue === undefined) {
      throw new ElaborationError(
        `Unsolved patternVar: ${patternVar.neutral.name}`,
      )
    }

    argValue = deepWalk(this.solution, argValue)

    let argType = lookupTypeInCtx(this.ctx, patternVar.neutral.name)
    if (argType === undefined) {
      throw new ElaborationError(
        `Undefined arg type name: ${patternVar.neutral.name}`,
      )
    }

    argType = deepWalk(this.solution, argType)

    const argCore = readback(this.ctx, argType, argValue)
    return Inferred(inferred.type, Cores.ImplicitAp(inferred.core, argCore))
  }

  private insertPassedArgs(inferred: Inferred): Inferred {
    for (const argCore of this.passedArgs) {
      inferred = Inferred(inferred.type, Cores.Ap(inferred.core, argCore))
    }

    return inferred
  }

  private insertArgs(inferred: Inferred): Inferred {
    for (const arg of this.args) {
      inferred = this.insertArg(inferred, arg)
    }

    return inferred
  }

  private insertArg(inferred: Inferred, arg: Exps.Arg): Inferred {
    Values.assertTypeInCtx(this.ctx, inferred.type, Values.Pi)

    const argCore = Exps.check(this.ctx, arg.exp, inferred.type.argType)
    const argValue = evaluate(ctxToEnv(this.ctx), argCore)

    switch (arg.kind) {
      case "ArgPlain": {
        return Inferred(
          applyClosure(inferred.type.retTypeClosure, argValue),
          Cores.Ap(inferred.core, argCore),
        )
      }

      case "ArgImplicit": {
        return Inferred(
          applyClosure(inferred.type.retTypeClosure, argValue),
          Cores.ImplicitAp(inferred.core, argCore),
        )
      }
    }
  }
}
