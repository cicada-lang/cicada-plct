import { Core } from "../core"
import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Exp } from "../exp"

export function disallowExtraProperty(
  ctx: Ctx,
  coreProperties: Record<string, Core>,
  properties: Record<string, Exp>
): void {
  const extraNames = []
  for (const [name, property] of Object.entries(properties)) {
    if (coreProperties[name] === undefined) {
      extraNames.push(name)
    }
  }

  if (extraNames.length === 1) {
    throw new ElaborationError(`extra property: ${extraNames}`)
  } else if (extraNames.length > 1) {
    throw new ElaborationError(`extra properties: ${extraNames}`)
  }
}
