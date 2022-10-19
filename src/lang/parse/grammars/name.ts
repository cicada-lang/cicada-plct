import pt from "@cicada-lang/partech"

/**

   NOTE An important design goal of this language is to have no preserved words.

**/

export const name = pt.grammars.pattern_unless_preserved("identifier", [])
