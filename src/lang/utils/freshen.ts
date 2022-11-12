export function freshen(
  usedNames: Array<string> | Set<string>,
  name: string,
): string {
  usedNames = new Set(usedNames)
  let counter = 1
  let freshName = name
  while (true) {
    if (usedNames.has(freshName)) {
      freshName = `${name}${counter}`
      counter++
    } else {
      return freshName
    }
  }
}
