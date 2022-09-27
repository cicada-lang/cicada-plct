export const equation = {
  $grammar: {
    "equation:unify_typed": [
      '"unify"',
      { left: "exp" },
      '"="',
      { right: "exp" },
      '":"',
      { type: "exp" },
    ],
    "equation:unify": ['"unify"', { left: "exp" }, '"="', { right: "exp" }],
  },
}
