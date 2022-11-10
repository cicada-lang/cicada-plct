import * as Cores from "../../core"
import { evaluate } from "../../core"
import * as Exps from "../../exp"
import { Exp, infer } from "../../exp"
import { Mod } from "../../mod"
import { Span } from "../../span"
import { Stmt } from "../../stmt"
import * as Values from "../../value"

export class ClazzExtends extends Stmt {
  constructor(
    public name: string,
    public parent: Exp,
    public clazz: Exps.ClazzUnfolded,
    public span?: Span,
  ) {
    super()
  }

  async execute(mod: Mod): Promise<void> {
    const inferredParent = infer(mod, mod.ctx, this.parent)
    const parentClazz = evaluate(mod.env, inferredParent.core)
    Values.assertClazzInCtx(mod, mod.ctx, parentClazz)
    const parentClazzCore = Values.readbackClazz(mod, mod.ctx, parentClazz)
    const ctx = Values.clazzExtendCtx(mod, mod.ctx, parentClazz)
    const superObjekt = Exps.ObjektUnfolded(
      Values.clazzPropertyNames(parentClazz).map((name) =>
        Exps.PropertyPlain(name, Exps.Var(name)),
      ),
      this.span,
    )
    const clazz = Exps.substExp(this.clazz, "super", superObjekt)
    const inferred = infer(mod, ctx, clazz)
    Cores.assertClazz(inferred.core)
    const core = Cores.clazzAppend(parentClazzCore, inferred.core)
    const value = evaluate(mod.env, core)
    mod.define(this.name, inferred.type, value)
  }

  undo(mod: Mod): void {
    mod.delete(this.name)
  }
}
