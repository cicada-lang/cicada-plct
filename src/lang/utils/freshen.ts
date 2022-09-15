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

export function freshenNames(
  used: Set<string>,
  names: Set<string>,
): Map<string, string> {
  used = new Set([...used, ...names])
  const freshNameMap = new Map()
  for (const name of names) {
    const freshName = freshen(used, name)
    freshNameMap.set(name, freshName)
    used.add(freshName)
  }

  return freshNameMap
}
