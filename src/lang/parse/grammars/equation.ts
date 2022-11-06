export const equation = {
  $grammar: {
    "equation:unify_typed": [
      { left: "exp" },
      '"="',
      { right: "exp" },
      '":"',
      { type: "exp" },
    ],
    "equation:unify": [{ left: "exp" }, '"="', { right: "exp" }],
  },
}
