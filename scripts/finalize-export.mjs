import { rm } from "node:fs/promises";
// Next requires one static param before the first article exists. Remove its
// not-found placeholder so hosts return a real 404 for the reserved URL.
await rm("out/writing/_empty", { recursive: true, force: true });
