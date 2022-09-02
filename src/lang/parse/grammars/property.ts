export const property = {
  $grammar: {
    "property:field_shorthand": [{ name: "identifier" }],
    "property:field": [{ name: "identifier" }, '":"', { exp: "exp" }],
  },
}
