import pt from "@cicada-lang/partech"

export function key_matcher(tree: pt.Tree): string {
  return pt.matcher({
    "key:name": ({ name }) => pt.str(name),
    "key:quote": ({ literal }) => pt.trim_boundary(pt.str(literal), 1),
  })(tree)
}
