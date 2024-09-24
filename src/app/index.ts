import { App } from "./App.js"

declare global {
  var app: App
}

export const app = new App()

globalThis.app = app
