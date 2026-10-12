// Kilo Code (kilo.ai) is a fork of OpenCode, so it reaches any
// OpenAI-compatible endpoint the way OpenCode does: a provider under
// `provider.<id>` with an AI SDK package, a base URL and the models it
// has, and a top-level `model` naming what to use. Everything lives in
// ~/.config/kilo/kilo.jsonc, next to the user's own settings, which
// magpie's writer keeps.
export const agent = {
  id: "kilo",
  name: "Kilo Code",
  // kilo.ai's own mark, on the Agents page and the plugin's row
  icon: "https://github.com/Kilo-Org.png",
  bin: "kilo",
  config: "~/.config/kilo/kilo.jsonc",
  format: "json",
  // kilo.jsonc is the CLI's global config; a project's .kilo/ wins over
  // it, so a pick here is the default, not an override
  model: "model",
  // Kilo names a model <provider>/<model>, and magpie's ids already hold
  // slashes (<provider>/<model>), so the value is magpie/<id>
  prefix: "magpie/",
  ua: ["kilo", "opencode"],
  notice: "Kilo reads its settings when it starts: restart it to use the new model.",
  // Kilo reads the Library the way OpenCode does: instructions and skills
  // under its config folder, MCP servers in kilo.jsonc's `mcp` key
  library: {
    instructions: "~/.config/kilo/AGENTS.md",
    mcp: "~/.config/kilo/kilo.jsonc",
    mcpFormat: "opencode",
    skills: "~/.config/kilo/skills",
  },
}

// Kilo has no model catalog of its own for a gateway like magpie, so the
// provider, its address and every model have to be written beside the
// model itself; `models` is each one magpie offers Kilo.
export function connect({ gateway, models }) {
  const catalog = {}
  for (const m of models ?? []) {
    catalog[m.id] = {
      name: m.name ?? m.id,
      tool_call: true,
      reasoning: (m.efforts?.length ?? 0) > 0,
      limit: { context: m.context ?? 0, output: m.output ?? 0 },
    }
  }
  return {
    "provider.magpie.name": "magpie",
    "provider.magpie.npm": "@ai-sdk/openai",
    "provider.magpie.options.baseURL": gateway.v1,
    "provider.magpie.options.apiKey": gateway.key,
    "provider.magpie.models": catalog,
  }
}
