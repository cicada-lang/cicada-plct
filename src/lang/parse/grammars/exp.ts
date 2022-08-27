/**

   # We must separate exp into operator and operand

   Otherwise `(x) => f(x)` will be ambiguous:

   ```js
   Fn("x", Ap(Var("f"), Var("x")))
   Ap(Fn("x", Var("f")), Var("x"))
   ```

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
      { typings: "typings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "operand:pi_forall": [
      '"forall"',
      '"("',
      { typings: "typings" },
      '")"',
      { ret_t: "exp" },
    ],
    "operand:fn": [
      '"("',
      { names: "names" },
      '")"',
      '"="',
      '">"',
      { ret: "exp" },
    ],
    "operand:fn_function": [
      '"function"',
      '"("',
      { names: "names" },
      '")"',
      { ret: "exp" },
    ],
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
    // "arg_entry:implicit": ['"implicit"', { arg: "exp" }],
    // "arg_entry:vague": ['"vague"', { arg: "exp" }],
  },
}

export const typings = {
  $grammar: {
    "typings:typings": [
      { entries: { $ap: ["zero_or_more", "typing", '","'] } },
      { last_entry: "typing" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const typing = {
  $grammar: {
    "typing:nameless": [{ exp: "exp" }],
    "typing:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
    // "typing:implicit": [
    //   '"implicit"',
    //   { name: "identifier" },
    //   '":"',
    //   { exp: "exp" },
    // ],
    // "typing:vague": ['"vague"', { name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const names = {
  $grammar: {
    "names:names": [
      { entries: { $ap: ["zero_or_more", "name_entry", '","'] } },
      { last_entry: "name_entry" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const name_entry = {
  $grammar: {
    "name_entry:name_entry": [{ name: "identifier" }],
    // "name_entry:implicit_name_entry": ['"implicit"', { name: "identifier" }],
    // "name_entry:vague_name_entry": ['"vague"', { name: "identifier" }],
  },
}
