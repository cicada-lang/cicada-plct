#!/usr/bin/env -S node --no-warnings

import { createCommandRunner } from "../lib/command-line/index.js"

Error.stackTraceLimit = Infinity
createCommandRunner().run()
