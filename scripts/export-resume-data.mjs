import fs from "node:fs";
import ts from "typescript";
// Compile only the public data modules; no application or browser code is evaluated.
function load(name) {
  if (!["profile", "recoveredProfile"].includes(name))
    throw new Error("Unexpected profile module");
  const code = ts.transpileModule(
    fs.readFileSync(`src/lib/${name}.ts`, "utf8"),
    { compilerOptions: { module: ts.ModuleKind.CommonJS } },
  ).outputText;
  const compiledModule = { exports: {} };
  new Function("require", "module", "exports", code)(
    (name) => load(name.replace("./", "")),
    compiledModule,
    compiledModule.exports,
  );
  return compiledModule.exports;
}
process.stdout.write(
  JSON.stringify({ ...load("profile"), ...load("recoveredProfile") }),
);
