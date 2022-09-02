import pt from "@cicada-lang/partech"
import * as grammars from "./grammars"
import * as matchers from "./matchers"

/**

   TODO We should use `camelCase` naming convention,
   but "@cicada-lang/partech" is using `snake_case`,
   we follow the library for now (will change eventually).

**/

export const parseExp = pt.gen_parse({
  preprocess: pt.preprocess.erase_comment,
  lexer: pt.lexers.common,
  grammar: pt.grammar_start(grammars, "exp"),
  matcher: matchers.exp_matcher,
})

export const parseStmts = pt.gen_parse({
  preprocess: pt.preprocess.erase_comment,
  lexer: pt.lexers.common,
  grammar: pt.grammar_start(grammars, "stmts"),
  matcher: matchers.stmts_matcher,
})
