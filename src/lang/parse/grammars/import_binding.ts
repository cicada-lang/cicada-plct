export const import_binding = {
  $grammar: {
    "import_binding:name": [{ name: "name" }, { $ap: ["optional", '","'] }],
    "import_binding:alias": [
      { name: "name" },
      '"as"',
      { alias: "name" },
      { $ap: ["optional", '","'] },
    ],
  },
}
