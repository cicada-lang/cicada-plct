export type Exp = Var | Pi | Ap | Fn | Sigma | Cons | Car | Cdr

export type Var = { kind: "Var"; name: string }

export function Var(name: string): Var {
  return { kind: "Var", name }
}

export type Pi = { kind: "Pi"; name: string; argType: Exp; retType: Exp }
export type Fn = { kind: "Fn"; name: string; ret: Exp }
export type Ap = { kind: "Ap"; target: Exp; arg: Exp }

export function Pi(name: string, argType: Exp, retType: Exp): Pi {
  return { kind: "Pi", name, argType, retType }
}

export function Fn(name: string, ret: Exp): Fn {
  return { kind: "Fn", name, ret }
}

export function Ap(target: Exp, arg: Exp): Ap {
  return { kind: "Ap", target, arg }
}

export type Sigma = { kind: "Sigma"; name: string; carType: Exp; cdrType: Exp }
export type Cons = { kind: "Cons"; car: Exp; cdr: Exp }
export type Car = { kind: "Car"; target: Exp }
export type Cdr = { kind: "Cdr"; target: Exp }
