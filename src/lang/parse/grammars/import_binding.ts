export const import_binding = {
  $grammar: {
    "import_binding:name": [
      { name: "identifier" },
      { $ap: ["optional", '","'] },
    ],
    "import_binding:alias": [
      { name: "identifier" },
      '"as"',
      { alias: "identifier" },
      { $ap: ["optional", '","'] },
    ],
  },
}
