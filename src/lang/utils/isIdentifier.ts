const identifierRegExp = new RegExp("^([-_\\p{Letter}][-_\\p{Letter}0-9]*)$", "u")

export function isIdentifier(text: string): boolean {
  return identifierRegExp.test(text)
}
