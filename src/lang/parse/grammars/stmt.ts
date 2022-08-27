export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}

export const stmt = {
  $grammar: {
    "stmt:declare": ['"declare"', { name: "identifier" }, '":"', { t: "exp" }],
    "stmt:check": ['"check"', { exp: "exp" }, '":"', { t: "exp" }],
    "stmt:let": ['"let"', { name: "identifier" }, '"="', { exp: "exp" }],
    "stmt:let_the": [
      '"let"',
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
    ],
    // "stmt:compute": ['"compute"', { exp: "exp" }],
  },
}
