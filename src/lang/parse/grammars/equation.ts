export const equation = {
  $grammar: {
    "equation:equation": [
      '"equation"',
      { left: "exp" },
      '"="',
      { right: "exp" },
      '":"',
      { type: "exp" },
    ],
  },
}
