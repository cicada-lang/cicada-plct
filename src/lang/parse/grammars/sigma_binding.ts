export const sigma_binding = {
  $grammar: {
    "sigma_binding:nameless": [{ exp: "exp" }],
    "sigma_binding:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
  },
}

export const sigma_bindings = {
  $grammar: {
    "sigma_bindings:sigma_bindings": [
      { entries: { $ap: ["zero_or_more", "sigma_binding", '","'] } },
      { last_entry: "sigma_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}
