const identifierRegExp = new RegExp(
  "^\\s*([-_\\p{Letter}][-_\\p{Letter}0-9]*)\\s*",
)

export function isIdentifier(text: string): boolean {
  return identifierRegExp.test(text)
}
