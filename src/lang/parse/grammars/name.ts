import * as pt from "@cicada-lang/partech"

/**

   NOTE An important design goal of this language
   is to have no preserved words, so that
   we can use all name as identifiers.

   TODO Currently we still can not use `cons` as identifier.

**/

export const name = pt.grammars.pattern_unless_preserved("identifier", [])
