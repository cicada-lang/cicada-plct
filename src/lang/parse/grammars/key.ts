export const key = {
  $grammar: {
    "key:name": [{ name: "name" }],
    "key:string": [{ literal: { $pattern: ["string"] } }],
  },
}
