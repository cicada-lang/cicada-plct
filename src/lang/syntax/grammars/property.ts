export const property = {
  $grammar: {
    "property:field_shorthand": [{ key: "key" }],
    "property:field": [{ key: "key" }, '":"', { exp: "exp" }],
    "property:method": [
      { key: "key" },
      '"("',
      { bindings: "fn_bindings" },
      '")"',
      { sequence: "sequence" },
    ],
    "property:spread": ['"."', '"."', '"."', { exp: "exp" }],
  },
}
