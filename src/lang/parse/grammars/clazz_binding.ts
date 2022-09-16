export const clazz_binding = {
  $grammar: {
    "clazz_binding:field_abstract": [
      { name: "name" },
      '":"',
      { t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_binding:field_fulfilled": [
      { name: "name" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_binding:method_abstract": [
      { name: "name" },
      '"("',
      { bindings: "pi_bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_binding:method_fulfilled": [
      { name: "name" },
      '"("',
      { bindings: "pi_bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { sequence: "sequence" },
    ],
  },
}
