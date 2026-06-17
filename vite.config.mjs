import { readdirSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

function collectHtmlInputs(dir, inputs = {}) {
  for (const entry of readdirSync(dir)) {
    if (entry === ".git" || entry === "node_modules" || entry === "dist") {
      continue;
    }

    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      collectHtmlInputs(fullPath, inputs);
      continue;
    }

    if (entry.endsWith(".html")) {
      const key = relative(root, fullPath).replace(/\\/g, "/").replace(/\.html$/, "");
      inputs[key] = fullPath;
    }
  }

  return inputs;
}

export default defineConfig({
  appType: "mpa",
  build: {
    rollupOptions: {
      input: collectHtmlInputs(root)
    }
  }
});
