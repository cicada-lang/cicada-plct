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
    "operator:var": [{ name: "name" }],
    "operator:ap": [
      { target: "operator" },
      { args_group: { $ap: ["one_or_more", '"("', "args", '")"'] } },
    ],
    "operator:dot_field": [{ target: "operator" }, '"."', { name: "name" }],
    "operator:dot_field_quote": [
      { target: "operator" },
      '"["',
      { data: { $pattern: ["string"] } },
      '"]"',
    ],
    "operator:dot_method": [
      { target: "operator" },
      '"."',
      { name: "name" },
      { args_group: { $ap: ["one_or_more", '"("', "args", '")"'] } },
    ],
    "operator:dot_method_quote": [
      { target: "operator" },
      '"["',
      { data: { $pattern: ["string"] } },
      '"]"',
      { args_group: { $ap: ["one_or_more", '"("', "args", '")"'] } },
    ],
    "operator:sequence": [{ sequence: "sequence" }],
  },
}

export const operand = {
  $grammar: {
    "operand:pi": [
      '"("',
      { bindings: "pi_bindings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "operand:pi_forall": [
      '"forall"',
      '"("',
      { bindings: "pi_bindings" },
      '")"',
      { ret_t: "exp" },
    ],
    "operand:fn": [
      '"("',
      { bindings: "fn_bindings" },
      '")"',
      '"="',
      '">"',
      { ret: "exp" },
    ],
    "operand:fn_function": [
      '"function"',
      '"("',
      { bindings: "fn_bindings" },
      '")"',
      { sequence: "sequence" },
    ],
    "operand:fn_function_with_ret_type": [
      '"function"',
      '"("',
      { bindings: "fn_bindings" },
      '")"',
      '":"',
      { ret_type: "exp" },
      { sequence: "sequence" },
    ],
    "operand:sigma_exists": [
      '"exists"',
      '"("',
      { bindings: "sigma_bindings" },
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
    "operand:quote": [{ data: { $pattern: ["string"] } }],
    "operand:clazz": [
      '"class"',
      '"{"',
      { bindings: { $ap: ["zero_or_more", "clazz_binding"] } },
      '"}"',
    ],
    "operand:objekt": [
      '"{"',
      { properties: { $ap: ["zero_or_more", "property", '","'] } },
      { last_property: "property" },
      { $ap: ["optional", '","'] },
      '"}"',
    ],
    "operand:new": [
      '"new"',
      { name: "name" },
      '"{"',
      { properties: { $ap: ["zero_or_more", "property", '","'] } },
      { last_property: "property" },
      { $ap: ["optional", '","'] },
      '"}"',
    ],
    "operand:new_ap": [
      '"new"',
      { name: "name" },
      '"("',
      { args: "args" },
      '")"',
    ],
    "operand:equivalent": [
      '"equivalent"',
      { type: "exp" },
      '"{"',
      { from: "exp" },
      { rest: { $ap: ["zero_or_more", "equivalent_entry"] } },
      '"}"',
    ],
  },
}
