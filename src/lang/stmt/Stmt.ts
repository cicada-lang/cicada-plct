import type { Mod } from "../mod/index.js"
import type { Span } from "../span/index.js"

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

export abstract class Stmt {
  abstract span?: Span
  abstract execute(mod: Mod): Promise<string | void>
  undo(mod: Mod): void {}
}
