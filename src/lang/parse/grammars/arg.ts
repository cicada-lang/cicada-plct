export const arg = {
  $grammar: {
    "arg:plain": [{ arg: "exp" }],
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
