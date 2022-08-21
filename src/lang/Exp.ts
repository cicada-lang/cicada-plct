export type Exp = Var | Pi | Ap | Fn

export type Var = { kind: "Var"; name: string }

export function Var(name: string): Var {
  return { kind: "Var", name }
}

export type Pi = { kind: "Pi"; name: string; retType: Exp }
export type Ap = { kind: "Ap"; target: Exp; arg: Exp }
export type Fn = { kind: "Fn"; name: string; ret: Exp }

export function Pi(name: string, retType: Exp): Pi {
  return { kind: "Pi", name, retType }
}

export function Ap(target: Exp, arg: Exp): Ap {
  return { kind: "Ap", target, arg }
}

export function Fn(name: string, ret: Exp): Fn {
  return { kind: "Fn", name, ret }
}
