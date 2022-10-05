export const sequence = {
  $grammar: {
    "sequence:sequence": [
      '"{"',
      { entries: { $ap: ["zero_or_more", "sequence_entry"] } },
      '"return"',
      { ret: "exp" },
      '"}"',
    ],
  },
}

export const sequence_entry = {
  $grammar: {
    "sequence_entry:let": ['"let"', { name: "name" }, '"="', { exp: "exp" }],
    "sequence_entry:let_the": [
      '"let"',
      { name: "name" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
    ],
    "sequence_entry:check": ['"check"', { exp: "exp" }, '":"', { t: "exp" }],
    "sequence_entry:let_function": [
      '"function"',
      { name: "name" },
      '"("',
      { bindings: "fn_bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { sequence: "sequence" },
    ],
  },
}
