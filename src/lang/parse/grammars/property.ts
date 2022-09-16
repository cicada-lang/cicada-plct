export const property = {
  $grammar: {
    "property:field_shorthand": [{ name: "name" }],
    "property:field": [{ name: "name" }, '":"', { exp: "exp" }],
    "property:method": [
      { name: "name" },
      '"("',
      { bindings: "fn_bindings" },
      '")"',
      { sequence: "sequence" },
    ],
    "property:spread": ['"."', '"."', '"."', { exp: "exp" }],
  },
}
