import { Ctx } from "../ctx"
import { Solution, solveType } from "../solution"
import { Value } from "../value"

export function solveByType(
  solution: Solution,
  ctx: Ctx,
  type: Value,
  left: Value,
  right: Value,
): Solution | undefined {
  switch (type.kind) {
    case "Type": {
      return solveType(solution, ctx, left, right)
    }

    default: {
      return undefined
    }
  }
}
