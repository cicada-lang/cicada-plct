import { expect, test } from "vitest"
import { Fetcher } from "../fetcher"

test("A fetcher can handle http and https by default.", async () => {
  const fetcher = new Fetcher()

  await fetcher.fetch(new URL("http://bing.com"))
  await fetcher.fetch(new URL("https://bing.com"))
})

test("A fetcher can not handler other protocols by default.", async () => {
  const fetcher = new Fetcher()

  await expect(
    fetcher.fetch(new URL("file-store:example-file.txt")),
  ).rejects.toThrow()
})

test("We can extend a fetcher by registering new handler to protocol.", async () => {
  const fetcher = new Fetcher()

  fetcher.register("echo", (url) => {
    return url.href
  })

  const href = await fetcher.fetch(new URL("echo:abc"))
  expect(href).toEqual("echo:abc")
})
