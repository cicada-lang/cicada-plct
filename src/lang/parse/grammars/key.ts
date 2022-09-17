export const key = {
  $grammar: {
    "key:name": [{ name: "name" }],
    "key:quote": [{ literal: { $pattern: ["string"] } }],
  },
}
