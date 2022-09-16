import pt from "@cicada-lang/partech"

/**

   TODO Implement `car` and `cdr` as globals,
   after we are able do unification between functions.

**/

/**

   NOTE Only operator need to be preserved word.

   For example, "cons" does not need to be a preserved word.

**/

export const name = pt.grammars.pattern_unless_preserved("identifier", [
  "car",
  "cdr",
])
