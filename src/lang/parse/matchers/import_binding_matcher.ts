import * as pt from "@cicada-lang/partech"
import * as Stmts from "../../stmts"

export function import_binding_matcher(tree: pt.Tree): Stmts.ImportBinding {
  return pt.matcher<Stmts.ImportBinding>({
    "import_binding:name": ({ name }) => Stmts.ImportBindingName(pt.str(name)),
    "import_binding:alias": ({ name, alias }) =>
      Stmts.ImportBindingAlias(pt.str(name), pt.str(alias)),
  })(tree)
}
