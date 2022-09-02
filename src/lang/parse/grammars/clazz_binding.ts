export const clazz_binding = {
  $grammar: {
    "clazz_binding:field_abstract": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_binding:field_fulfilled": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_binding:method_abstract": [
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
