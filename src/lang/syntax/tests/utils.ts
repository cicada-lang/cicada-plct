export function deleteUndefined(value: any) {
  return JSON.parse(JSON.stringify(value))
}
