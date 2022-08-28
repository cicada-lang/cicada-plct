/**

   # We must separate exp into operator and operand

   Otherwise `(x) => f(x)` will be ambiguous,
   -- maybe `Fn` maybe `Ap`.

**/

export const exp = {
  $grammar: {
    "exp:operator": [{ operator: "operator" }],
    "exp:operand": [{ operand: "operand" }],
  },
}

export const operator = {
  $grammar: {
    "operator:var": [{ name: "identifier" }],
    "operator:ap": [
      { target: "operator" },
      {
        arg_entries_group: {
          $ap: ["one_or_more", '"("', "arg_entries", '")"'],
        },
      },
    ],
  },
}

export const operand = {
  $grammar: {
    "operand:pi": [
      '"("',
      { pi_bindings: "pi_bindings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "operand:pi_forall": [
      '"forall"',
      '"("',
      { pi_bindings: "pi_bindings" },
      '")"',
      { ret_t: "exp" },
    ],
    "operand:fn": [
      '"("',
      { fn_bindings: "fn_bindings" },
      '")"',
      '"="',
      '">"',
      { ret: "exp" },
    ],
    "operand:fn_function": [
      '"function"',
      '"("',
      { fn_bindings: "fn_bindings" },
      '")"',
      { ret: "exp" },
    ],
    "operand:sigma_exists": [
      '"exists"',
      '"("',
      { sigma_bindings: "sigma_bindings" },
      '")"',
      { cdr_t: "exp" },
    ],
  },
}

export const pi_bindings = {
  $grammar: {
    "pi_bindings:pi_bindings": [
      { entries: { $ap: ["zero_or_more", "pi_binding", '","'] } },
      { last_entry: "pi_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const pi_binding = {
  $grammar: {
    "pi_binding:nameless": [{ exp: "exp" }],
    "pi_binding:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const fn_bindings = {
  $grammar: {
    "fn_bindings:fn_bindings": [
      { entries: { $ap: ["zero_or_more", "fn_binding", '","'] } },
      { last_entry: "fn_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const fn_binding = {
  $grammar: {
    "fn_binding:name": [{ name: "identifier" }],
    "fn_binding:annotated": [{ name: "identifier" }, '":"', { t: "exp" }],
  },
}

export const sigma_bindings = {
  $grammar: {
    "sigma_bindings:sigma_bindings": [
      { entries: { $ap: ["zero_or_more", "sigma_binding", '","'] } },
      { last_entry: "sigma_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const sigma_binding = {
  $grammar: {
    "sigma_binding:nameless": [{ exp: "exp" }],
    "sigma_binding:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const arg_entries = {
  $grammar: {
    "arg_entries:arg_entries": [
      { entries: { $ap: ["zero_or_more", "arg_entry", '","'] } },
      { last_entry: "arg_entry" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const arg_entry = {
  $grammar: {
    "arg_entry:plain": [{ arg: "exp" }],
  },
}
