export const equation = {
  $grammar: {
    "equation:typed": [
      '"equation"',
      { left: "exp" },
      '"="',
      { right: "exp" },
      '":"',
      { type: "exp" },
    ],
    "equation:untyped": [
      '"equation"',
      { left: "exp" },
      '"="',
      { right: "exp" },
    ],
  },
}
