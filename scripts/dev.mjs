import { spawn } from "node:child_process";
// Accept the preview daemon's Vite-style flags while retaining Next's dev server.
const args = process.argv
  .slice(2)
  .filter((arg) => arg !== "--strictPort")
  .map((arg) => (arg === "--host" ? "--hostname" : arg));
const preview = process.argv.includes("--strictPort");
const portIndex = args.indexOf("--port");
const child = spawn(
  process.execPath,
  preview
    ? ["scripts/serve-export.mjs"]
    : ["node_modules/next/dist/bin/next", "dev", ...args],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      ...(preview
        ? { HOST: "0.0.0.0", PORT: args[portIndex + 1] ?? "4173" }
        : {}),
    },
  },
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
