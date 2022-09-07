import { ElaborationError } from "../errors"

export class AlphaCtx {
  constructor(
    public depth = 0,
    public leftNameMap: Map<string, number> = new Map(),
    public rightNameMap: Map<string, number> = new Map(),
  ) {}

  assertEqualNames(leftName: string, rightName: string): void {
    const leftDepth = this.leftNameMap.get(leftName)
    const rightDepth = this.rightNameMap.get(rightName)

    if (leftDepth === rightDepth) return

    throw new ElaborationError(
      `AlphaCtx.assertEqualNames expect the left depth: ${leftDepth} (${leftName}) to be equal to the right depth: ${rightDepth} (${rightName})`,
    )
  }

  cons(leftName: string, rightName: string): AlphaCtx {
    return new AlphaCtx(
      this.depth + 1,
      new Map([...this.leftNameMap, [leftName, this.depth]]),
      new Map([...this.rightNameMap, [rightName, this.depth]]),
    )
  }
}
