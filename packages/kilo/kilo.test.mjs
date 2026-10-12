import { expect, test } from "bun:test"
import { agent, connect } from "./kilo.agent.js"

test("says where Kilo keeps its model", () => {
  expect(agent).toMatchObject({
    id: "kilo",
    config: "~/.config/kilo/kilo.jsonc",
    format: "json",
    model: "model",
    prefix: "magpie/",
  })
})

test("shows Kilo's own icon, as the package gives it", async () => {
  const pkg = await Bun.file(new URL("./package.json", import.meta.url)).json()
  expect(pkg.magpie.icon).toBe(agent.icon)
  expect(pkg.magpie.agent).toBe("./kilo.agent.js")
})

test("points Kilo at magpie as an OpenAI-compatible provider", () => {
  const out = connect({
    gateway: { url: "http://127.0.0.1:3425", v1: "http://127.0.0.1:3425/v1", key: "magpie-kilo" },
    model: { id: "deepseek/deepseek-flash", name: "DeepSeek Flash" },
    models: [
      { id: "deepseek/deepseek-flash", name: "DeepSeek Flash", context: 1000000, output: 393216, efforts: ["high", "max"] },
      { id: "trae-cn/glm-5.3-flash", name: "GLM 5.3 Flash", context: 200000, output: 32000 },
    ],
    agent: { id: "kilo", config: "/home/u/.config/kilo/kilo.jsonc" },
  })
  expect(out).toEqual({
    "provider.magpie.name": "magpie",
    "provider.magpie.npm": "@ai-sdk/openai",
    "provider.magpie.options.baseURL": "http://127.0.0.1:3425/v1",
    "provider.magpie.options.apiKey": "magpie-kilo",
    "provider.magpie.models": {
      "deepseek/deepseek-flash": {
        name: "DeepSeek Flash",
        tool_call: true,
        reasoning: true,
        limit: { context: 1000000, output: 393216 },
      },
      "trae-cn/glm-5.3-flash": {
        name: "GLM 5.3 Flash",
        tool_call: true,
        reasoning: false,
        limit: { context: 200000, output: 32000 },
      },
    },
  })
})

test("writes a provider with no models when magpie offers none", () => {
  const out = connect({
    gateway: { url: "http://127.0.0.1:3425", v1: "http://127.0.0.1:3425/v1", key: "k" },
    models: [],
    agent: { id: "kilo", config: "/home/u/.config/kilo/kilo.jsonc" },
  })
  expect(out["provider.magpie.models"]).toEqual({})
})
