export function freshen(used: Set<string>, name: string): string {
  let counter = 1
  let freshName = name
  while (true) {
    if (used.has(freshName)) {
      freshName = `${name}${counter}`
      counter++
    } else {
      return freshName
    }
  }
}
