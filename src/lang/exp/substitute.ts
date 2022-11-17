import type { Exp } from "../exp"
import * as Exps from "../exp"
import { freshen } from "../utils/freshen"

export function substitute(body: Exp, name: string, exp: Exp): Exp {
  switch (body.kind) {
    case "Var": {
      if (body.name === name) {
        return exp
      } else {
        return body
      }
    }

    case "Pi": {
      if (body.name === name) {
        return Exps.Pi(
          body.name,
          substitute(body.argType, name, exp),
          body.retType,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const retType = substitute(body.retType, body.name, Exps.Var(freshName))
        return Exps.Pi(
          freshName,
          substitute(body.argType, name, exp),
          substitute(retType, name, exp),
          body.span,
        )
      }
    }

    case "PiImplicit": {
      if (body.name === name) {
        return Exps.PiImplicit(
          body.name,
          substitute(body.argType, name, exp),
          body.retType,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const retType = substitute(body.retType, body.name, Exps.Var(freshName))
        return Exps.PiImplicit(
          freshName,
          substitute(body.argType, name, exp),
          substitute(retType, name, exp),
          body.span,
        )
      }
    }

    case "PiUnfolded": {
      return substitute(Exps.foldPi(body.bindings, body.retType), name, exp)
    }

    case "Ap": {
      return Exps.Ap(
        substitute(body.target, name, exp),
        substitute(body.arg, name, exp),
        body.span,
      )
    }

    case "ApImplicit": {
      return Exps.ApImplicit(
        substitute(body.target, name, exp),
        substitute(body.arg, name, exp),
        body.span,
      )
    }

    case "ApUnfolded": {
      return substitute(Exps.foldAp(body.target, body.args), name, exp)
    }

    case "Fn": {
      if (body.name === name) {
        return body
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const ret = substitute(body.ret, body.name, Exps.Var(freshName))
        return Exps.Fn(freshName, substitute(ret, name, exp), body.span)
      }
    }

    case "FnAnnotated": {
      if (body.name === name) {
        return Exps.FnAnnotated(
          body.name,
          substitute(body.argType, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const ret = substitute(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnAnnotated(
          freshName,
          substitute(body.argType, name, exp),
          substitute(ret, name, exp),
          body.span,
        )
      }
    }

    case "FnImplicit": {
      if (body.name === name) {
        return body
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const ret = substitute(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnImplicit(freshName, substitute(ret, name, exp), body.span)
      }
    }

    case "FnImplicitAnnotated": {
      if (body.name === name) {
        return Exps.FnImplicitAnnotated(
          body.name,
          substitute(body.argType, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const ret = substitute(body.ret, body.name, Exps.Var(freshName))
        return Exps.FnImplicitAnnotated(
          freshName,
          substitute(body.argType, name, exp),
          substitute(ret, name, exp),
          body.span,
        )
      }
    }

    case "FnUnfolded": {
      return substitute(Exps.foldFn(body.bindings, body.ret), name, exp)
    }

    case "FnUnfoldedWithRetType": {
      return substitute(
        Exps.foldFnWithRetType(body.bindings, body.retType, body.ret),
        name,
        exp,
      )
    }

    case "Sigma": {
      if (body.name === name) {
        return Exps.Sigma(
          body.name,
          substitute(body.carType, name, exp),
          body.cdrType,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const cdrType = substitute(body.cdrType, body.name, Exps.Var(freshName))
        return Exps.Sigma(
          freshName,
          substitute(body.carType, name, exp),
          substitute(cdrType, name, exp),
          body.span,
        )
      }
    }

    case "SigmaUnfolded": {
      return substitute(Exps.foldSigma(body.bindings, body.cdrType), name, exp)
    }

    case "Cons": {
      return Exps.Cons(
        substitute(body.car, name, exp),
        substitute(body.cdr, name, exp),
        body.span,
      )
    }

    case "Quote": {
      return body
    }

    case "ClazzNull": {
      return body
    }

    case "ClazzCons": {
      if (body.localName === name) {
        return Exps.ClazzCons(
          body.propertyName,
          body.localName,
          substitute(body.propertyType, name, exp),
          body.rest,
          body.name,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.localName)
        const rest = substitute(body.rest, body.localName, Exps.Var(freshName))
        return Exps.ClazzCons(
          body.propertyName,
          freshName,
          substitute(body.propertyType, name, exp),
          substitute(rest, name, exp) as Exps.Clazz,
          body.name,
          body.span,
        )
      }
    }

    case "ClazzFulfilled": {
      if (body.localName === name) {
        return Exps.ClazzFulfilled(
          body.propertyName,
          body.localName,
          substitute(body.propertyType, name, exp),
          substitute(body.property, name, exp),
          body.rest,
          body.name,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.localName)
        const rest = substitute(body.rest, body.localName, Exps.Var(freshName))
        return Exps.ClazzFulfilled(
          body.propertyName,
          freshName,
          substitute(body.propertyType, name, exp),
          substitute(body.property, name, exp),
          substitute(rest, name, exp) as Exps.Clazz,
          body.name,
          body.span,
        )
      }
    }

    case "ClazzUnfolded": {
      return substitute(Exps.foldClazz(body.bindings, body.name), name, exp)
    }

    case "Objekt": {
      return Exps.Objekt(
        Object.fromEntries(
          Object.entries(body.properties).map(([propertyName, property]) => [
            propertyName,
            substitute(property, name, exp),
          ]),
        ),
        body.span,
      )
    }

    case "ObjektUnfolded": {
      return Exps.ObjektUnfolded(
        body.properties.map((property) => substProperty(property, name, exp)),
        body.span,
      )
    }

    case "New": {
      return Exps.New(
        body.name,
        Object.fromEntries(
          Object.entries(body.properties).map(([propertyName, property]) => [
            propertyName,
            substitute(property, name, exp),
          ]),
        ),
        body.span,
      )
    }

    case "NewUnfolded": {
      return Exps.NewUnfolded(
        body.name,
        body.properties.map((property) => substProperty(property, name, exp)),
        body.span,
      )
    }

    case "NewAp": {
      return Exps.NewAp(
        body.name,
        body.args.map((arg) => substArg(arg, name, exp)),
        body.span,
      )
    }

    case "Dot": {
      return Exps.Dot(substitute(body.target, name, exp), body.name, body.span)
    }

    case "SequenceLet": {
      if (body.name === name) {
        return Exps.SequenceLet(
          body.name,
          substitute(body.exp, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const ret = substitute(body.ret, body.name, Exps.Var(freshName))
        return Exps.SequenceLet(
          freshName,
          substitute(body.exp, name, exp),
          substitute(ret, name, exp),
          body.span,
        )
      }
    }

    case "SequenceLetThe": {
      if (body.name === name) {
        return Exps.SequenceLetThe(
          body.name,
          substitute(body.type, name, exp),
          substitute(body.exp, name, exp),
          body.ret,
          body.span,
        )
      } else {
        const freeNames = [
          ...Exps.freeNames(new Set(), exp),
          ...Exps.freeNames(new Set(), body),
        ]
        const freshName = freshen(freeNames, body.name)
        const ret = substitute(body.ret, body.name, Exps.Var(freshName))
        return Exps.SequenceLetThe(
          freshName,
          substitute(body.type, name, exp),
          substitute(body.exp, name, exp),
          substitute(ret, name, exp),
          body.span,
        )
      }
    }

    case "SequenceCheck": {
      return Exps.SequenceCheck(
        substitute(body.exp, name, exp),
        substitute(body.type, name, exp),
        substitute(body.ret, name, exp),
        body.span,
      )
    }

    case "SequenceUnfolded": {
      return substitute(Exps.foldSequence(body.bindings, body.ret), name, exp)
    }

    case "Equivalent": {
      return Exps.Equivalent(
        substitute(body.type, name, exp),
        substitute(body.from, name, exp),
        body.tail.map(({ via, to }) => ({
          via: substitute(via, name, exp),
          to: substitute(to, name, exp),
        })),
        body.span,
      )
    }
  }
}

function substArg(arg: Exps.Arg, name: string, exp: Exp): Exps.Arg {
  switch (arg.kind) {
    case "ArgPlain": {
      return Exps.ArgPlain(substitute(arg.exp, name, exp))
    }

    case "ArgImplicit": {
      return Exps.ArgImplicit(substitute(arg.exp, name, exp))
    }
  }
}

function substProperty(
  property: Exps.Property,
  name: string,
  exp: Exp,
): Exps.Property {
  switch (property.kind) {
    case "PropertyPlain": {
      return Exps.PropertyPlain(
        property.name,
        substitute(property.exp, name, exp),
      )
    }

    case "PropertySpread": {
      return Exps.PropertySpread(substitute(property.exp, name, exp))
    }
  }
}
