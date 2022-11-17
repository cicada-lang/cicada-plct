export const equivalent_entry = {
  $grammar: {
    "equivalent_entry:via": ['"|"', { via: "exp" }, '"="', { to: "exp" }],
    "equivalent_entry:via_refl": ['"="', { to: "exp" }],
  },
}
