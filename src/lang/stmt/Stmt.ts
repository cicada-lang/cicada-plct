import { Mod } from "../mod"
import { Span } from "../span"

/**

   # Stmt and Command Pattern

   A `Stmt` is like a method of `Mod`,
   but implemented as an independent Command class.

   Unlike `Exp`, `Core`, `Value` and `Neutral`,
   which are closed ADT that will **not** be extended often.
   `Stmt` is an open abstract class that will be extended more often.

   Unlike functions about `Exp`, `Core`, `Value` and `Neutral`,
   which are pure, `stmt.execute` does side effects on `mod`.

**/

export type StmtOutput = string

export abstract class Stmt {
  abstract span?: Span
  abstract execute(mod: Mod): Promise<StmtOutput | void>
  undo(mod: Mod): void {}
}
