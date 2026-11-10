import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
// Imported here, not read from disk, so Vite restarts the dev server when tokens.json changes.
import tokens from "../tokens.json" with { type: "json" };
import { tokensCss } from "./tokens-css.ts";

const ID = "virtual:kilo-tokens";

/** Serves tokens.json as a CSS string. A tokens.json that fails validation fails the build. */
function kiloTokens(): Plugin {
  const css = tokensCss(tokens);
  return {
    name: "kilo-tokens",
    resolveId: (id) => (id === ID ? "\0" + ID : undefined),
    load: (id) => (id === "\0" + ID ? `export default ${JSON.stringify(css)};` : undefined),
  };
}

export default defineConfig({ plugins: [react(), kiloTokens()] });
