export const clazz_binding = {
  $grammar: {
    "clazz_binding:field_abstract": [
      { key: "key" },
      '":"',
      { t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_binding:field_fulfilled": [
      { key: "key" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_binding:method_abstract": [
      { key: "key" },
      '"("',
      { bindings: "pi_bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "clazz_binding:method_fulfilled": [
      { key: "key" },
      '"("',
      { bindings: "pi_bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { sequence: "sequence" },
    ],
  },
}
