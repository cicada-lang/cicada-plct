export const property = {
  $grammar: {
    "property:field_shorthand": [{ name: "identifier" }],
    "property:field": [{ name: "identifier" }, '":"', { exp: "exp" }],
    "property:method": [
      { name: "identifier" },
      '"("',
      { bindings: "fn_bindings" },
      '")"',
      { sequence: "sequence" },
    ],
  },
}
