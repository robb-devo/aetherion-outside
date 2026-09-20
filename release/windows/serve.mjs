import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "game");
const port = Number(process.env.PORT || 8088);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".hdr": "application/octet-stream",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith("/")) rel += "index.html";
  if (rel === "/") rel = "/index.html";
  if (rel === "/__shutdown" || rel === "__shutdown") {
    res.writeHead(204);
    res.end();
    server.close();
    return;
  }
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(path.normalize(root))) {
    res.writeHead(403);
    res.end();
    return;
  }
  const send = (p) => {
    fs.readFile(p, (err, data) => {
      if (err) {
        if (rel !== "/index.html") return send(path.join(root, "index.html"));
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const ext = path.extname(p).toLowerCase();
      res.writeHead(200, {
        "Content-Type": mime[ext] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(data);
    });
  };
  send(file);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Aetherion Outside → http://127.0.0.1:${port}/`);
  console.log("Leave this window open. Close it to quit.");
});
