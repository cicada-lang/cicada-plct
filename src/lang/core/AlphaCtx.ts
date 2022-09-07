export class AlphaCtx {
  constructor(
    public depth = 0,
    public leftNameMap: Map<string, number> = new Map(),
    public rightNameMap: Map<string, number> = new Map(),
  ) {}

  cons(leftName: string, rightName: string): AlphaCtx {
    return new AlphaCtx(
      this.depth + 1,
      new Map([...this.leftNameMap, [leftName, this.depth]]),
      new Map([...this.rightNameMap, [rightName, this.depth]]),
    )
  }
}
