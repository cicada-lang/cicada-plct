export const solve_binding = {
  $grammar: {
    "solve_binding:named": [{ name: "identifier" }, '":"', { type: "exp" }],
  },
}

export const solve_bindings = {
  $grammar: {
    "solve_bindings:solve_bindings": [
      { entries: { $ap: ["zero_or_more", "solve_binding", '","'] } },
      { last_entry: "solve_binding" },
      { $ap: ["optional", '","'] },
    ],
  },
}
