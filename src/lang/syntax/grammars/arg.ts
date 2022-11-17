export const arg = {
  $grammar: {
    "arg:plain": [{ arg: "exp" }],
    "arg:implicit": ['"implicit"', { arg: "exp" }],
  },
}

export const args = {
  $grammar: {
    "args:args": [
      { entries: { $ap: ["zero_or_more", "arg", '","'] } },
      { last_entry: "arg" },
      { $ap: ["optional", '","'] },
    ],
  },
}
