#!/usr/bin/env -S node

const process = require("process")

process.on("unhandledRejection", (error) => {
  console.error(error)
  process.exit(1)
})

Error.stackTraceLimit = Infinity

const { createCommandRunner } = require("../lib/console")

createCommandRunner().run()
