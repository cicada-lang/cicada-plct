import * as pt from "@cicada-lang/partech"

export function key_matcher(tree: pt.Tree): string {
  return pt.matcher({
    "key:name": ({ name }) => pt.str(name),
    "key:quote": ({ data }) => pt.trim_boundary(pt.str(data), 1),
  })(tree)
}
