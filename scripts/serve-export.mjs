import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const port = Number(process.env.PORT ?? 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    try {
      const url = new URL(req.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (basePath && pathname === basePath) {
        res.writeHead(308, { Location: `${basePath}/${url.search}` }).end();
        return;
      }
      if (!pathname.startsWith(`${basePath}/`)) {
        res.writeHead(404).end("Not found");
        return;
      }
      let file = path.resolve(root, "." + pathname.slice(basePath.length));
      if (!file.startsWith(root + path.sep) && file !== root) {
        res.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) {
        if (!url.pathname.endsWith("/")) {
          res
            .writeHead(308, { Location: `${url.pathname}/${url.search}` })
            .end();
          return;
        }
        file = path.join(file, "index.html");
      }
      const bytes = await readFile(file);
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(req.method === "HEAD" ? undefined : bytes);
    } catch {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        req.method === "HEAD"
          ? undefined
          : await readFile(path.join(root, "404.html")).catch(
              () => "Not found",
            ),
      );
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Preview: http://127.0.0.1:${port}${basePath}/`),
  );
