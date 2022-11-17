export const equivalent_rest_entry = {
  $grammar: {
    "equivalent_rest_entry:via": ['"|"', { via: "exp" }, '"="', { to: "exp" }],
    "equivalent_rest_entry:via_refl": ['"="', { to: "exp" }],
  },
}
