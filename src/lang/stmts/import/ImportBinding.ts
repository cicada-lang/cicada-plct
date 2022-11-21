export type ImportBinding = ImportBindingName | ImportBindingAlias

export type ImportBindingName = {
  "@kind": "ImportBindingName"
  name: string
}

export function ImportBindingName(name: string): ImportBindingName {
  return {
    "@kind": "ImportBindingName",
    name,
  }
}

export type ImportBindingAlias = {
  "@kind": "ImportBindingAlias"
  name: string
  alias: string
}

export function ImportBindingAlias(
  name: string,
  alias: string,
): ImportBindingAlias {
  return {
    "@kind": "ImportBindingAlias",
    name,
    alias,
  }
}
