import { Ctx } from "../ctx"
import { ElaborationError } from "../errors"
import { Neutral } from "../neutral"
import { Closure } from "./Closure"

export type Value = NotYetValue | Global | Pi | Fn

export type NotYetValue = {
  family: "Value"
  kind: "NotYetValue"
  type: Value
  neutral: Neutral
}

export function NotYetValue(type: Value, neutral: Neutral): NotYetValue {
  return {
    family: "Value",
    kind: "NotYetValue",
    type,
    neutral,
  }
}

/**

   TODO We will need `args: Array<Values.Arg>` for currying.

**/

export type Global = {
  family: "Value"
  kind: "Global"
  name: string
  type: Value
  arity: number
}

export function Global(name: string, type: Value, arity: number): Global {
  return {
    family: "Value",
    kind: "Global",
    name,
    type,
    arity,
  }
}

export type Pi = {
  family: "Value"
  kind: "Pi"
  argType: Value
  retTypeClosure: Closure
}

export function Pi(argType: Value, retTypeClosure: Closure): Pi {
  return {
    family: "Value",
    kind: "Pi",
    argType,
    retTypeClosure,
  }
}

export type Fn = {
  family: "Value"
  kind: "Fn"
  retClosure: Closure
}

export function Fn(retClosure: Closure): Fn {
  return {
    family: "Value",
    kind: "Fn",
    retClosure,
  }
}

export function assertValue<
  ValueConstructor extends (...args: Array<any>) => Value
>(
  ctx: Ctx,
  value: Value,
  valueConstructor: ValueConstructor
): ReturnType<ValueConstructor> {
  const kind = valueConstructor.name

  if (value.kind === kind) {
    return value as ReturnType<ValueConstructor>
  }

  throw new ElaborationError(
    `expect value to have kind: ${kind}, instead of: ${value.kind}`
  )
}
