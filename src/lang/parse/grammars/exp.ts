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
    "operator:car": ['"car"', '"("', { target: "exp" }, '")"'],
    "operator:cdr": ['"cdr"', '"("', { target: "exp" }, '")"'],
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
    "operand:cons": [
      '"cons"',
      '"("',
      { car: "exp" },
      '","',
      { cdr: "exp" },
      '")"',
    ],
    "operand:quote": [{ literal: { $pattern: ["string"] } }],
    "operand:clazz": [
      '"class"',
      '"{"',
      { entries: { $ap: ["zero_or_more", "clazz_entry"] } },
      '"}"',
    ],
  },
}
