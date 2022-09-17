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

export function freshenNames(
  usedNames: Array<string> | Set<string>,
  names: Array<string> | Set<string>,
): Map<string, string> {
  usedNames = new Set([...usedNames, ...names])
  const freshNameMap = new Map()
  for (const name of names) {
    const freshName = freshen(usedNames, name)
    freshNameMap.set(name, freshName)
    usedNames.add(freshName)
  }

  return freshNameMap
}
