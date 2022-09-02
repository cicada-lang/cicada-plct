export const clazz_entry = {
  $grammar: {
    "clazz_entry:field_demanded": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_entry:field_fulfilled": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_entry:method_demanded": [
      { name: "identifier" },
      '"("',
      { pi_bindings: "pi_bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { $ap: ["optional", '","'] },
    ],
  },
}
