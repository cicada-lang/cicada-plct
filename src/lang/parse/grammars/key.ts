export const key = {
  $grammar: {
    "key:name": [{ name: "name" }],
    "key:quote": [{ data: { $pattern: ["string"] } }],
  },
}
